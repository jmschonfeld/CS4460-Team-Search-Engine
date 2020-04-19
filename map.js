var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('#map')[0],
        width = w.innerWidth || e.clientWidth || g.clientWidth,
        height = w.innerHeight|| e.clientHeight|| g.clientHeight;


// Sclae projection to fit in SVG:
var projection = d3.geoAlbersUsa()
        .scale(1000*1.25)
        .translate([width / 2, height / 2]);


var path = d3.geoPath()
        .projection(projection);


// Create SCG with specified width and height:
var svgMap = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

// Define scale for bubble radius:
var radius = d3.scaleSqrt()
        .domain([0, 1e4*1000])
        .range([0, 15*1000]);


// Read US map data:
d3.json("data_collection/us.json").then(function(us) {

    // Add filled US land:
    svgMap.insert("path", ".graticule")
            .datum(topojson.feature(us, us.objects.land))
            .attr("class", "land")
            .attr("d", path);

    // Add state boundaries:
    svgMap.insert("path", ".graticule")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("class", "state-boundary")
            .attr("d", path);

    d3.json("data_collection/all_state_data.json").then(function(d) {

        var initPoint = d['obesity']['04/19/2015'];
        initPoint = Object.values(initPoint);

        svgMap.selectAll("circle")
            .data(initPoint).enter()
            .append("circle")
                .attr("class", "bubble")
            .attr("cx", function (d) {
                return projection([d.long,d.lat])[0];
            })
            .attr("cy", function (d) {
                return projection([d.long,d.lat])[1]; })
            .attr("r", "6px")
            .attr("r", function(d) {
                return radius(d.weight)
            } )
            .attr("fill", "#00E5FF");
    });

});
d3.select(self.frameElement).style("height", height + "px");
