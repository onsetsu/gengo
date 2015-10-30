export function zoom(svg) {
    // zooming
    var zoomBehavior = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);


    function zoomed() {
        container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    var zoomGroup = svg.append('g')
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .call(zoomBehavior)

    // This rect helps to recognize all zoom and panning
    // interactions, when the user interacts with the background.
    // It itself is as large as the svg, and is a child of the
    // group specifying the zooming behavior.
    zoomGroup.append("rect")
        .attr("width", '100%')
        .attr("height", '100%')
        .style("fill", "blue")
        .attr("fill-opacity", .1)
        .style("pointer-events", "all");

    var container = zoomGroup.append('g');

    return container;
}
