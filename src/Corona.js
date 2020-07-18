import React, { useEffect } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import "./Corona.css";

export const Corona = (props) => {
  useEffect(() => {
    buildCoronaMap();
  }, []);
  function buildCoronaMap() {
    console.log("building corona map");
    var svg = d3.select("#mapsvg").style("margin-top","0px").style("display","none").style("background-color","#A2A2A2");
    var path = d3.geoPath();
    var tooltipHeight = 60;
    var tooltipWidth = 200;

    var zoom = d3.zoom().on("zoom", zoomed);

    var g = svg.append("g");

    var colorScale = d3.scaleLog()
      .interpolate(d3.interpolateRgb)
      .range([d3.rgb("#FFFFFF"), d3.rgb('#710019')]);


    svg.call(zoom).call(zoom.transform, d3.zoomIdentity.translate(-3600,-800).scale(5)); // delete this line to disable free zooming
    // .call(zoom.event); // not in d3 v4

    var tooltip = d3.select(".card-body").append("div") 
      .attr("class", "tooltip")       
      .style("opacity", 0)
      .style("height", tooltipHeight)
      .style("width", tooltipWidth);
    // var usStates =d3.json("https://d3js.org/us-10m.v1.json").then(function(us) {

    const stateDataByFips = {};
    d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv").then(function(stateData) {
      stateData = stateData.sort(function(a,b) {
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
      stateData.forEach((el) => {
        if(stateDataByFips[el.fips] == null) {
            stateDataByFips[el.fips]=[el];
          } else {
            stateDataByFips[el.fips].push(el);
          }
      })
      console.log(stateData);
      console.log(stateDataByFips);
      Object.values(stateDataByFips).forEach((el)=> {
        usTotalCases = usTotalCases + parseInt(el[0].cases);
        usTotalDeaths = usTotalDeaths + parseInt(el[0].deaths);
        usCasesYesterday = usCasesYesterday + (el[1] != null ? parseInt(el[1].cases) : 0);
        usDeathsYesterday = usDeathsYesterday + (el[1] != null ? parseInt(el[1].deaths) : 0);
      })
      newCases = usTotalCases - usCasesYesterday;
      newDeaths = usTotalDeaths - usDeathsYesterday;

      let paTotalCases = stateDataByFips["42"][0].cases;
      let paCasesYesterday = stateDataByFips["42"][1].cases;
      let paTotalDeaths = stateDataByFips["42"][0].deaths;
      let paDeathsYesterday = stateDataByFips["42"][1].deaths;
      let paNewCases = parseInt(paTotalCases) - parseInt(paCasesYesterday);
      let paNewDeaths = parseInt(paTotalDeaths) - parseInt(paDeathsYesterday);
    }); 
    const countyDataByFips = {}
    const stateIds = []
    var usStates = d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json").then(function(us) {
      us.objects.states.geometries.forEach(geometry => {
        stateIds[geometry.id] = geometry.properties.name;
      })

      d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv").then(function(covidData) {
        covidData = covidData.sort(function(a,b) {
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
        
        var extent = d3.extent(covidData, function(d) {return parseInt(d.cases);})
        // extent[1] = extent[1] * .15
        extent[0] = 1;
        var colorScale = d3.scaleLog()
          .domain(extent)
          .range(["#FFFFFF", '#710019'])
        console.log("extent " + extent);
        us.objects.counties.geometries.forEach(function(d) {
          
          d.properties.id = d.id;
          d.properties.stateId = d.id.toString().slice(0,2);
          d.properties.stateName = stateIds[d.properties.stateId];
          let exceptional = getCaseDataForExceptions(d.properties.id);
          let caseData;
          let newCases;
          let newDeaths;
          let color;
          if (exceptional != null) {
            caseData = countyDataByFips[exceptional[0]] != null ? countyDataByFips[exceptional[0]] : null;
          } else {
            if (d.properties.id == "36029") {
              console.log("Erie data" + console.log(countyDataByFips[d.properties.id]))
            }
            caseData = countyDataByFips[d.properties.id] != null ? countyDataByFips[d.properties.id] : null;
          }
          if (caseData != null) {
            let casesToday = caseData[0].cases;
            let deathsToday = caseData[0].deaths;
            let casesYesterday = caseData[1] != null ? caseData[1].cases : 0;
            let deathsYesterday = caseData[1] != null ? caseData[1].deaths : 0;

            newCases = parseInt(casesToday) - parseInt(casesYesterday)
            newDeaths = parseInt(deathsToday) - parseInt(deathsYesterday)
          } else {
            newCases = 0;
            newDeaths = 0;
          }
          color = colorScale(caseData != null ? parseInt(caseData[0].cases) : 0);
          d.properties.caseData = caseData;
          d.properties.color = color;
          d.properties.newCases = newCases;
          d.properties.newDeaths = newDeaths;
        })
        setColors();
      });

      g.selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
          .attr("class","counties")
          .attr("d", path)
          .attr("id", "county")
          .style("stroke","#D2D2D2")
          .style("opacity",0.7)
          .on("click", clicked)
          .on("mouseover", mouseover)
          .on("mousemove",mousemove)
          .on("mouseout",mouseout);

      g.append("path")
        .attr("class", "state-borders")
        .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })))
        .style("stroke", "black");

      g.append("path")
        .attr("d",path(topojson.merge(us, us.objects.states.geometries.filter(function(d) { return d.id; }))))
        .attr("class", "us-border");

      var focus;
      function mouseover() {
        focus = d3.select(this).style("opacity",1).style("stroke","#aa0026");
        let cardBody = d3.select(".card-body").node().getBoundingClientRect();
        let offsetTop = cardBody.y;
        let offsetLeft = cardBody.x
        let dataProperties = d3.select(this).data()[0].properties;
        let countyId = dataProperties.id;
        let countyName = dataProperties.name;
        let stateName = dataProperties.stateName;
        let numCases = dataProperties.caseData !== null ? dataProperties.caseData[0].cases : "no cases reported";
        let numDeaths = dataProperties.caseData !== null ? dataProperties.caseData[0].deaths : "no deaths reported";
        let newCases = dataProperties.newCases;
        let newDeaths = dataProperties.newDeaths;
        let exceptional = getCaseDataForExceptions(countyId);
        if (exceptional === null) {
          tooltip
              .style("opacity", 0.9);    
              tooltip.html("<p><strong>" + dataProperties.name + ", " + dataProperties.stateName + "</strong><p>" +
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
        focus.style("opacity",0.7).style("stroke","#D2D2D2");
        tooltip   
            .style("opacity", 0) 
      }


    });

    function setColors() {
      console.log("called set colors");
      d3.selectAll(".counties")
        .style("fill", function(d) {
          return d.properties.color;
        })
      svg.style("display", "block");
      d3.select(".loader").style("display","none");
    }

    
    function clicked() {
    }

    function zoomed() {
      g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
      // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
      g.attr("transform", d3.event.transform); // updated for d3 v4
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