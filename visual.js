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

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("drag", dragmove);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var newg = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) { return 'translate('+d.x+', '+d.y+')'; })
    .attr("cursor", "move")
    .call(drag);

var dragrect = newg.append("rect")
    .attr("width", function(d) { return d.width; })
    .attr("height", function(d) { return d.height; })
    .attr("fill-opacity", .5);

newg.append("text")
    //.attr("dy", ".35em")
    .text(function(d) { return d.name; });

function dragmove(d) {
    d3.select(this)
        .attr("transform", function(d) { return 'translate('+ (d.x = d3.event.x)+', '+ (d.y = d3.event.y)+')'; })
}