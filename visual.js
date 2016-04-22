'use strict';

import {} from 'src/gengo/gengo-interpreter.js';
import { zoom } from 'src/visualizer/zoom.js';

var width = '100%',
    height = '100%';

d3.json('./sample-program.json', function(error, data) {
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

    var svg = d3.select("body").append("svg")
        .attr('oncontextmenu', 'return false;')
        .attr("width", width)
        .attr("height", height);

    var container = zoom(svg);

    var nodeGroup = container.selectAll("g")
        .data(data.nodes);

    nodeGroup.enter().append("g")
        .attr("transform", function(d) { return 'translate('+d.x+', '+d.y+')'; })
        .attr("cursor", "move")
        .call(drag);

    nodeGroup.append("rect")
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .attr("fill-opacity", .5);

    nodeGroup.append("text")
        .text(function(d) { return d.name; });

});
