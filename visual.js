'use strict';

import {} from 'src/gengo/gengo-interpreter.js';

var width = 1280,
    height = 700;

var data = [
    {
        type: 'Node',
        name: 'foo.jai',
        x: 400,
        y: 100,
        width: 200,
        height: 200
    },
    {
        type: 'Node',
        name: 'foo.jai',
        x: 200,
        y: 200,
        width: 300,
        height: 100
    },
    {
        type: 'Node',
        name: 'foo.jai',
        x: 300,
        y: 400,
        width: 400,
        height: 50
    }
];

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// dragging
var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
}

function dragged(d) {
    d3.select(this)
        .attr("transform", function(d) {
            return 'translate('+ (d.x = d3.event.x)+', '+ (d.y = d3.event.y)+')';
        });
}

function dragended(d) {
    d3.select(this).classed("dragging", false);
}

// zooming
var zoomBehavior = d3.behavior.zoom()
    //.x(x)
    //.y(y)
    .scaleExtent([1, 8])
    .on("zoom", zoom);


function zoomed() {
    container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function zoom() {
    zoomGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
var zoomGroup = svg.append('g')
    .call(zoomBehavior)
    .append('g');

var nodeGroup = zoomGroup.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) { return 'translate('+d.x+', '+d.y+')'; })
    .attr("cursor", "move")
    .call(drag);

nodeGroup.append("rect")
    .attr("width", function(d) { return d.width; })
    .attr("height", function(d) { return d.height; })
    .attr("fill-opacity", .5);

nodeGroup.append("text")
    .text(function(d) { return d.name; });

