import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import {Transform} from "d3-zoom/src/transform"
import * as moment from "moment";
import "./Corona.css";
import { polygonContains } from "d3";

export const Corona = (props) => {
  const [usData, setUsData] = useState({});
  useEffect(() => {
    checkLocalStorageTimestamp();
    buildCoronaMap();
    getUsTopoJson();
    getStateCoronaData();
  }, []);
  function checkLocalStorageTimestamp() {
    let now = moment();
    console.log("now:")
    console.log(now.toString());
    let thirtyMinutesAgo = now.subtract(30,'minutes');
    console.log("thirty minutes ago:")
    console.log(thirtyMinutesAgo.toString());
    if (!localStorage.getItem("timestamp")) {
      localStorage.setItem("timestamp",now.toString());
    }
    console.log("test:")
    console.log(moment(localStorage.getItem("timestamp")).isBefore(thirtyMinutesAgo));
    if (moment(localStorage.getItem("timestamp")).isBefore(thirtyMinutesAgo)) {
      localStorage.clear();
      localStorage.setItem("timestamp",now.toString());
    }
  }
  async function getCountyCoronaData() {
    if (!localStorage.getItem("countyDataByFips")) {
      var countyDataByFips = {};
      await d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv").then(function(covidData) {
        let dayFilter = moment().subtract(3,'d');
        covidData = covidData.filter(el => dayFilter.isBefore(el.date)).sort(function(a,b) {
          a = new Date(a.date);
          b = new Date(b.date);
          return a < b ? 1 : -1;
        });
        covidData.forEach((el) => {
          if(countyDataByFips[el.fips] == null) {
            countyDataByFips[el.fips]=[el];
          } else {
            countyDataByFips[el.fips].push(el);
          }
          if(el.county == "New York City" || el.county == "Kansas City") {
            if (countyDataByFips[el.county] == null) {
              countyDataByFips[el.county] = [el];
            } else {
              countyDataByFips[el.county].push(el);
            }
          }
        });
        localStorage.setItem("countyDataByFips", JSON.stringify(countyDataByFips));
      });

      return countyDataByFips;
    } else{
      return JSON.parse(localStorage.getItem("countyDataByFips"));
    }
  }
  async function getUsTopoJson() {
    if (!localStorage.getItem("usTopoJson")) {
      var usTopoJson = {};
      var stateIds = {};
      await d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json").then(function(us) {
        us.objects.states.geometries.forEach(geometry => {
          stateIds[geometry.id] = geometry.properties.name;
        })
        localStorage.setItem("usTopoJson",JSON.stringify(us));
        localStorage.setItem("stateIds",JSON.stringify(stateIds));
        usTopoJson = us;
      });
      return [usTopoJson, stateIds]
    } else {
      usTopoJson = JSON.parse(localStorage.getItem("usTopoJson"));
      stateIds = JSON.parse(localStorage.getItem("stateIds"));
      return [usTopoJson, stateIds];
    }
  }
  async function getStateCoronaData() {
    if (!localStorage.getItem("stateDataByFips")) {
      var stateDataByFips = {};
      await d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv").then(function(stateDataFromGit) {
        stateDataFromGit = stateDataFromGit.sort(function(a,b) {
          a = new Date(a.date);
          b = new Date(b.date);
          return a < b ? 1 : -1;
        });

        let usTotalCases = 0;
        let usTotalDeaths = 0;
        let usCasesYesterday = 0;
        let usDeathsYesterday = 0;
        let newCases = 0;
        let newDeaths = 0;
        stateDataFromGit.forEach((el) => {
          if(stateDataByFips[el.fips] == null) {
              stateDataByFips[el.fips]=[el];
            } else {
              stateDataByFips[el.fips].push(el);
            }
        })
        Object.values(stateDataByFips).forEach((el)=> {
          usTotalCases = usTotalCases + parseInt(el[0].cases);
          usTotalDeaths = usTotalDeaths + parseInt(el[0].deaths);
          usCasesYesterday = usCasesYesterday + (el[1] != null ? parseInt(el[1].cases) : 0);
          usDeathsYesterday = usDeathsYesterday + (el[1] != null ? parseInt(el[1].deaths) : 0);
        })
        newCases = usTotalCases - usCasesYesterday;
        newDeaths = usTotalDeaths - usDeathsYesterday;
        setUsData({
          usTotalCases: usTotalCases,
          usTotalDeaths: usTotalDeaths,
          usCasesYesterday: usCasesYesterday,
          usDeathsYesterday: usDeathsYesterday,
          newCases: newCases,
          newDeaths: newDeaths
        })

        let paTotalCases = stateDataByFips["42"][0].cases;
        let paCasesYesterday = stateDataByFips["42"][1].cases;
        let paTotalDeaths = stateDataByFips["42"][0].deaths;
        let paDeathsYesterday = stateDataByFips["42"][1].deaths;
        let paNewCases = parseInt(paTotalCases) - parseInt(paCasesYesterday);
        let paNewDeaths = parseInt(paTotalDeaths) - parseInt(paDeathsYesterday);
        localStorage.setItem("stateDataByFips",JSON.stringify(stateDataByFips));
      });
      return stateDataByFips;
    } else {
      return JSON.parse(localStorage.getItem("stateDataByFips"));
    }
  }

  async function buildCoronaMap() {
    var svg = d3.select("#mapsvg").style("margin-top","0px").style("display","none").style("background-color","#A2A2A2");
    var path = d3.geoPath();
    var tooltipHeight = 60;
    var tooltipWidth = 200;

    var zoom = d3.zoom()
      .scaleExtent([1,8])
      .on("zoom", zoomed);

    var g = svg.append("g").attr("id","mapG");

    var tooltip = d3.select(".card-body").append("div") 
      .attr("class", "tooltip")       
      .style("opacity", 0)
      .style("height", tooltipHeight)
      .style("width", tooltipWidth);
    // var usStates =d3.json("https://d3js.org/us-10m.v1.json").then(function(us) {

    const [usTopoJson, stateIds] = await getUsTopoJson();
    const countyDataByFips = await getCountyCoronaData();
    const stateDataByFips = await getStateCoronaData();
    // get county extent and county colorscale
    let countyCasesAsList = Object.keys(countyDataByFips).map(key => countyDataByFips[key][0]);
    var countyExtent = d3.extent(countyCasesAsList, function(d) {return parseInt(d.cases)});
    countyExtent[0] = 1;
    var countyColorScale = d3.scaleLog()
      .domain(countyExtent)
      .range(["#FFFFFF", '#710019']);

    // map county corona data to county geometries
    usTopoJson.objects.counties.geometries.forEach(function(county) {
      county.properties.id = county.id;
      county.properties.stateId = county.id.toString().slice(0,2);
      county.properties.stateName = stateIds[county.properties.stateId];
      let exceptional = getCaseDataForExceptions(county.properties.id);
      let caseData;
      let newCases;
      let newDeaths;
      let color;
      let casesToday;
      let deathsToday;
      if (exceptional != null) {
        caseData = countyDataByFips[exceptional[0]] != null ? countyDataByFips[exceptional[0]] : null;
      } else {
        caseData = countyDataByFips[county.properties.id] != null ? countyDataByFips[county.properties.id] : null;
      }
      if (caseData != null) {
        casesToday = caseData[0].cases;
        deathsToday = caseData[0].deaths;
        let casesYesterday = caseData[1] != null ? caseData[1].cases : 0;
        let deathsYesterday = caseData[1] != null ? caseData[1].deaths : 0;

        newCases = parseInt(casesToday) - parseInt(casesYesterday)
        newDeaths = parseInt(deathsToday) - parseInt(deathsYesterday)
      } else {
        newCases = 0;
        newDeaths = 0;
      }
      color = countyColorScale(caseData != null ? parseInt(caseData[0].cases) : 0);
      // d.properties.caseData = caseData;
      county.properties.color = color;
      county.properties.newCases = newCases;
      county.properties.newDeaths = newDeaths;
      county.properties.numCases = casesToday;
      county.properties.numDeaths = deathsToday;
    })

    // get state extent and state colorscale
    let stateCasesAsList = Object.keys(stateDataByFips).filter(key => Object.keys(stateIds).includes(key)).map(key => stateDataByFips[key][0]);
    var stateExtent = d3.extent(stateCasesAsList, function(d) {return parseInt(d.cases)});
    stateExtent[0] = stateExtent[0] == 0 ? 1 : stateExtent[0];
    var stateColorScale = d3.scaleLog()
      .domain(stateExtent)
      .range(["#FFFFFF", '#710019']);

    topojson.feature(usTopoJson, usTopoJson.objects.states).features.forEach((state) => {
      state.properties.id = state.id;
      let caseData;
      let newCases;
      let newDeaths;
      let color;
      let casesToday;
      let deathsToday;
      caseData = stateDataByFips[state.properties.id] != null ? stateDataByFips[state.properties.id] : null;
      if (caseData != null) {
        casesToday = caseData[0].cases;
        deathsToday = caseData[0].deaths;
        let casesYesterday = caseData[1] != null ? caseData[1].cases : 0;
        let deathsYesterday = caseData[1] != null ? caseData[1].deaths : 0;
        newCases = parseInt(casesToday) - parseInt(casesYesterday)
        newDeaths = parseInt(deathsToday) - parseInt(deathsYesterday)
      } else {
        newCases = 0;
        newDeaths = 0;
      }
      color = stateColorScale(caseData != null ? parseInt(caseData[0].cases) : 0);
      // d.properties.caseData = caseData;
      state.properties.color = color;
      state.properties.newCases = newCases;
      state.properties.newDeaths = newDeaths;
      state.properties.numCases = casesToday;
      state.properties.numDeaths = deathsToday;
      state.properties.center = path.centroid(state);
    });

    var countiesVisible = false;
    function drawCounties() {
      g.selectAll("path")
        .data(topojson.feature(usTopoJson, usTopoJson.objects.counties).features)
        .enter()
        .append("path")
          .attr("class","counties")
          .attr("d", path)
          .attr("id", (d) => {
            return "county" + d.id;
          })
          .attr("clip-path", "url(#clip)")
          .style("stroke","#D2D2D2")
          .style("opacity",0.7)
          .style("fill", (d) => d.properties.color)
          .on("click", clicked)
          .on("mouseover", mouseover)
          .on("mousemove",mousemove)
          .on("mouseout",mouseout);
      countiesVisible = true;
    }
    function drawStateBorders() {
      g.append("path")
        .attr("class", "state-borders")
        .attr("d", path(topojson.mesh(usTopoJson, usTopoJson.objects.states, function(a, b) { return a !== b; })))
        .style("stroke", "black");
    }
    function drawStates() {
      g.selectAll("path")
        .data(topojson.feature(usTopoJson, usTopoJson.objects.states).features)
        .enter()
        .append("path")
          .attr("class","states")
          .attr("d", path)
          .attr("id", (d) => {
            return "state" + d.id;
          })
          .style("stroke","#D2D2D2")
          .style("opacity",0.7)
          .style("fill", (d) => d.properties.color)
          .on("click", clicked)
          .on("mouseover", mouseover)
          .on("mousemove",mousemove)
          .on("mouseout",mouseout);
    }
    function drawUS() {
      g.append("path")
      .attr("d",path(topojson.merge(usTopoJson, usTopoJson.objects.states.geometries.filter(function(d) { return d.id; }))))
      .attr("class", "us-border");
    }
    function removePaths() {
      g.selectAll("path").remove();

    }

    drawCounties();
    drawStateBorders();
    drawUS();


    function mouseover() {
      let focus = d3.select(this).style("opacity",1).style("stroke","#aa0026");
      let dataProperties = focus.data()[0].properties;
      let countyId = dataProperties.id;
      let numCases = dataProperties.numCases !== 0 ? dataProperties.numCases : "no cases reported";
      let numDeaths = dataProperties.numDeaths !== 0 ? dataProperties.numDeaths : "no deaths reported";
      let newCases = dataProperties.newCases;
      let newDeaths = dataProperties.newDeaths;
      let exceptional = getCaseDataForExceptions(countyId);
      let stateName = dataProperties.stateName != null ? dataProperties.stateName : "";
      if (exceptional === null) {
        tooltip
            .style("opacity", 0.9);    
            tooltip.html("<p><strong>" + dataProperties.name + ", " + stateName + "</strong><p>" +
            "<p>Cases: " + numCases + "</p>" +
            "<p>Deaths: " + numDeaths +
            "<p>New cases: " + newCases + "</p>" +
            "<p>New deaths: " + newDeaths + "</p>")
            // .style("left", (d3.event.pageX - offsetLeft - tooltipWidth*.8) + "px")   
            // .style("top", (d3.event.pageY - offsetTop - tooltipHeight*1.5) + "px");
            .style("left",d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
      } else {
        tooltip
            .style("opacity", 0.9);    
            tooltip.html("<p><strong>" + dataProperties.name + ", " + dataProperties.stateName + "</strong><p>" +
            "<p>Cases for " + exceptional[0] + ": " + numCases + "</p>" +
            "<p>Deaths for " + exceptional[0] + ": " + numDeaths + "</p>" +
            "<p>New cases: " + newCases + "</p>" +
            "<p>New deaths: " + newDeaths + "</p>")
            // .style("left", (d3.event.pageX - offsetLeft - tooltipWidth*0.8) + "px")   
            // .style("top", (d3.event.pageY - offsetTop - tooltipHeight*1.5) + "px");
            .style("left",d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
      }
    }

    function mousemove() {
      //
    }

    function mouseout() {
      d3.select(this).style("opacity",0.7).style("stroke","#D2D2D2");
      tooltip   
          .style("opacity", 0) 
    }
    function clicked(d) {
      console.log(d);
      var id = d3.event.target.__data__.properties.id;
    }
    var firstZoom = false;
    function zoomed(d) {
      // d3.select('#boundingPath').remove();

      g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
      // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
      g.attr("transform", d3.event.transform); // updated for d3 v4
      Object.assign(Transform.prototype, {
        invertY(y) {
          const scaleY = this.ky || this.k;
          return (y - this.y) / scaleY;
        },
        scaleY(k) {
          this.ky = k;
          return this;
        },
        toString() {
          const translate = `translate(${this.x},${this.y})`;
          const scale = `scale(${this.k},${this.ky || this.k})`;
          return `${translate} ${scale}`;
        }
      });
      let temp = {...d3.event.transform};
      let kx = temp.k;
      var clipRect = d3.select("#clipRect");
      const myTransform = (new Transform(1 / kx, (-temp.x)/kx, (-temp.y)/kx));
      if (firstZoom) {
        clipRect.attr("transform",myTransform.toString());
      }

      if (d3.event.transform.k > 4) {
        if (!countiesVisible) {
          removePaths();
          drawCounties();
          drawStateBorders();
          drawUS();
        }
      } else {
        if (countiesVisible) {
          removePaths();
          drawStates();
          drawStateBorders();
          drawUS();
          countiesVisible = false;
        }
      }
      firstZoom = true;
    }

    // Exceptions for New York, Kings, Queens, Bronx, Richmond -> New York City
    // Exceptions for Cass, Clay, Jackson, and Platte Kansas -> Kansas City
    function getCaseDataForExceptions(countyId) {
      let newYorkCityZips = ["36081", "36047", "36005", "36085","36061"];
      let kansasCityZips = ["29037", "29047", "29095", "29165"];
      if (newYorkCityZips.includes(countyId)) {
        return ["New York City","New York"];
      } else if (kansasCityZips.includes(countyId)) {
        return ["Kansas City", "Missouri"];
      } else {
        return null;
      }
    }

    function showMap() {
      d3.select("#mapsvg").style("display", "block");
      d3.select(".loader").style("display","none");
    }
    function setClip() {
      var mapBBox = svg.node().getBoundingClientRect();
      var clip = svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("id","clipRect")
        .attr("width", mapBBox.width)
        .attr("height", mapBBox.height);
    }

    showMap();
    setClip();
    svg.call(zoom)
      .call(zoom.transform, d3.zoomIdentity.translate(0,0).scale(1));
  }
  return(
    <>
        <div className="card-body pt-0">
          <div id="map">
            <div className="loader"></div>
            <svg id="mapsvg"/>
          </div>
        </div>
        <div id="disclaimer" className="row"><p>Data from <a href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html">The New York Times</a></p></div>
      </>
  );

  }

export default Corona;