import React, { useEffect } from "react";
import * as d3 from "d3";
import "./Timeline.css";
import { store } from './redux/store';
import { actions } from './redux/actions';

function Timeline(props) {
  useEffect(() => {
    buildTimeline();
  }, []);
  function buildTimeline() {
    var parseTime = d3.timeParse("%b %Y");
    var formatTime = d3.timeFormat("%b %Y");
    d3.csv("experience.csv").then(function(data) {
      data.forEach(function(d) {
        d.lane = +d.lane;
        d.id = +d.id;
        d.start = parseTime(d.start);
        d.end = parseTime(d.end);
      });

      var lanes = ["Work", "Education", "Experience"];
      var laneLogos = ["work.png", "education.jpg", "experience.png"];
      var laneLength = lanes.length;
      var timeBegin = d3.min(
        data.map(d => {
          return d.start;
        })
      );
      var copyTimeBegin = new Date(timeBegin.getTime());
      copyTimeBegin.setDate(copyTimeBegin.getDate() - 60);
      var timeEnd = d3.max(
        data.map(d => {
          return d.end;
        })
      );
      var margin = {
          top: 20,
          right: 15,
          bottom: 15,
          left: 120
        },
        w = 960 - margin.right - margin.left,
        h = 500 - margin.top - margin.bottom,
        miniHeight = laneLength * 12 + 50,
        mainHeight = h - miniHeight - 50;
      var x = d3
        .scaleTime()
        .domain([copyTimeBegin, timeEnd])
        .range([0, w]);
      var x1 = d3.scaleTime().range([0, w]);
      var y1 = d3
        .scaleLinear()
        .domain([0, laneLength])
        .range([0, mainHeight]);
      var y2 = d3
        .scaleLinear()
        .domain([0, laneLength])
        .range([0, miniHeight]);
      var chart = d3
        .select(".timelineDiv")
        .append("svg")
        .attr("width", w + margin.right + margin.left)
        .attr("height", h + margin.top + margin.bottom)
        .attr("rx",40)
        .attr("class", "chart");
      chart
        .append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", w)
        .attr("height", mainHeight);
      var main = chart
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", w)
        .attr("height", mainHeight)
        .attr("class", "main");

      var mini = chart
        .append("g")
        .attr(
          "transform",
          "translate(" + margin.left + "," + (mainHeight + margin.top) + ")"
        )
        .attr("width", w)
        .attr("height", miniHeight)
        .attr("class", "mini");
      //main lanes and texts
      var uniqueLanes = [...new Set(data.map(d => d.lane))];
      main
        .append("g")
        .selectAll(".laneLines")
        .data(uniqueLanes)
        .enter()
        .append("line")
        .attr("x1", margin.right)
        .attr("y1", function(lane) {
          return y1(lane);
        })
        .attr("x2", w)
        .attr("y2", function(lane) {
          return y1(lane);
        })
        .attr("stroke", "lightgray");
      main
        .append("g")
        .selectAll(".laneText")
        .data(lanes)
        .enter()
        .append("text")
        .text(function(d) {
          return d;
        })
        .attr("x", -margin.right)
        .attr("y", function(d, i) {
          return y1(i + 0.5);
        })
        .attr("dy", ".5ex")
        .attr("text-anchor", "end")
        .attr("class", "laneText");
      //mini lanes and texts
      mini
        .append("g")
        .selectAll(".laneLines")
        .data(uniqueLanes)
        .enter()
        .append("line")
        .attr("x1", margin.right)
        .attr("y1", function(lane) {
          return y2(lane);
        })
        .attr("x2", w)
        .attr("y2", function(lane) {
          return y2(lane);
        })
        .attr("stroke", "lightgray");

      mini
        .append("g")
        .selectAll(".laneText")
        .data(lanes)
        .enter()
        .append("text")
        .text(function(d) {
          return d;
        })
        .attr("x", -margin.right)
        .attr("y", function(d, i) {
          return y2(i + 0.5);
        })
        .attr("dy", ".5ex")
        .attr("text-anchor", "end")
        .attr("class", "laneText");

      var axisBottom = mini
        .append("g")
        .attr("transform", "translate(0," + (miniHeight + 10) + ")")
        .call(d3.axisBottom(x));
      axisBottom.selectAll("*").style("stroke", "#FFFFFFDE");

      var itemRects = main.append("g").attr("clip-path", "url(#clip)");

      //mini item rects
      mini
        .append("g")
        .selectAll("miniItems")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", function(d) {
          return "miniItem" + d.lane;
        })
        .attr("x", function(d) {
          return x(d.start);
        })
        .attr("y", function(d) {
          return y2(d.lane + 0.5) - 10;
        })
        .attr("width", function(d) {
          return x(d.end) - x(d.start);
        })
        .attr("height", 20)
        .style("rx", 5)
        .attr("stroke", "#FFFFFFDE")
        .style("stroke-width", "2");

      var brush = d3
        .brushX()
        .extent([[x.range()[0], 0], [x.range()[1], miniHeight - 1]])
        .on("brush", display);

      mini
        .append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", 1)
        .attr("height", miniHeight - 1)
        .attr("width", '100%');

      function display() {
        if (!d3.event) return;
        if (!d3.event.sourceEvent) return; // Only transition after input.
        if (!d3.event.selection) return;
        var rects,
          logos,
          logoBacks,
          logoOverlay,
          minExtent = d3.event.selection.map(x.invert)[0]
            ? d3.event.selection.map(x.invert)[0]
            : 0,
          maxExtent = d3.event.selection.map(x.invert)[1]
            ? d3.event.selection.map(x.invert)[1]
            : 0,
          visItems = data.filter(function(d) {
            return d.start < maxExtent && d.end > minExtent;
          });
        x1.domain([minExtent, maxExtent]);
        //update main item rects
        rects = itemRects
          .selectAll("rect")
          .data(visItems, function(d) {
            return d.id;
          })
          .attr("x", function(d) {
            return x1(d.start);
          })
          .attr("width", function(d) {
            return x1(d.end) - x1(d.start);
          });
        rects
          .enter()
          .append("rect")
          .attr("class", function(d) {
            return "miniItem" + d.lane;
          })
          .attr("id", d => "r" + d.id)
          .attr("x", function(d) {
            return x1(d.start);
          })
          .attr("y", function(d) {
            return y1(d.lane) + 10;
          })
          .attr("width", function(d) {
            return x1(d.end) - x1(d.start);
          })
          .attr("height", function(d) {
            return 0.8 * y1(1);
          })
          .attr("stroke", "#FFFFFFDE")
          .attr("stroke-width", "1")
          .attr("rx", 12);
        rects.exit().remove();

        logoBacks = itemRects
          .selectAll("circle")
          .data(visItems, function(d) {
            return d.id;
          })
          .attr("cx", function(d) {
            return x1(d.start);
          });

        logoBacks
          .enter()
          .append("circle")
          .attr("cx", function(d) {
            return x1(d.start);
          })
          .attr("cy", function(d) {
            return y1(d.lane + 0.5);
          })
          .attr("r", 30)
          .attr("fill", "white");
        logoBacks.exit().remove();

        // update the item labels
        logos = itemRects
          .selectAll("image")
          .data(visItems, function(d) {
            return d.id;
          })
          .attr("x", function(d) {
            return x1(d.start);
          });

        logos
          .enter()
          .append("image")
          .attr("xlink:href", d => `${laneLogos[d.lane]}`)
          .attr("x", function(d) {
            return x1(d.start);
          })
          .style("transform", "translate(-2.2%,-4%)")
          .attr("y", function(d) {
            return y1(d.lane + 0.5);
          })
          .attr("height", 40)
          .attr("width", 40)
          .attr("text-anchor", "start")
          .attr("class", d => "imageLane" + d.id)
          .attr("id", d => "i" + d.id);

        logos.exit().remove();

        logoOverlay = itemRects
          .selectAll("overlaycircle")
          .data(visItems, function(d) {
            return d.id;
          })
          .attr("cx", function(d) {
            return x1(d.start);
          });

        logoOverlay
          .enter()
          .append("circle")
          .attr("cx", function(d) {
            return x1(d.start);
          })
          .attr("cy", function(d) {
            return y1(d.lane + 0.5);
          })
          .attr("r", 30)
          .style("fill", "transparent")
          .style("cursor","pointer")
          //   // .style("fill-opacity", 0.0)
          .on("mousedown", function(data) {
            const modalState = {
              modalOpen: true,
              modalTitle: data.title,
              modalDescription: data.description,
              modalDetails: data.details,
              modalLocation: data.location,
              modalStart: formatTime(data.start),
              modalEnd: formatTime(data.end),
              modalImg: data.img
            };
            store.dispatch(actions.showAboutMeModal(modalState));
          });
        logoOverlay.exit().remove();
      }
      display();
    });
  }
  return (
    <>
      <div className="timelineDiv" />
      <svg className="textBox" />
      <></>
    </>
  );
}

export default Timeline;
