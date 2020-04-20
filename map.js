var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('#map')[0],
        width = 375,
        height = 250;


// Sclae projection to fit in SVG:
var projection = d3.geoAlbersUsa()
        .scale(500)
        .translate([width / 2, height / 2]);


var path = d3.geoPath()
        .projection(projection);


// Create SCG with specified width and height:
var svgMap = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

// Define scale for bubble radius:
var radius = d3.scaleSqrt()
        .domain([0, 1e5*1000])
        .range([0, 15*1000]);


// Used to set the topic and date if the update function is called before the json is loaded
defaultTopicMap = undefined;
defaultDateMap = undefined;

datasetMap = undefined;

// Updates the vizualization with a new topic and date
function updateMap(topic, date) {
  if (!datasetMap) {
    defaultTopicMap = topic;
    defaultDateMap = date;
  } else {
    updateMap_active(topic, date);
  }
}


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

    d3.json("data_collection/all_state_data.json").then(function(data) {
        datasetMap = data;

        if (defaultTopicMap && defaultDateMap) {
            // Call the update function if it was called before the data was loaded
            updateMap_active(defaultTopicMap, defaultDateMap);
        }
        console.log("[MAP] NOTICE: Data set loaded successfully");
    });

});

function updateMap_active(topic, date) {
    if (!datasetMap) {
        console.error("[MAP] ERROR: Called updateMap_active() before dataset has loaded. Please wait until D3 has loaded the dataset before calling updateMap_active().");
        return;
    }

    var initPoint = datasetMap[topic][date];
        initPoint = Object.values(initPoint);

    var nodes = svgMap.selectAll("circle")
        .data(initPoint);
    var nodesEnter = nodes.enter()
        .append("circle")
        .attr("class", "bubble");

    var update = nodes.merge(nodesEnter);


    update.attr("cx", function (d) {
            return projection([d.long,d.lat])[0];
        })
        .attr("cy", function (d) {
            return projection([d.long,d.lat])[1]; })
        .attr("r", "6px")
        .attr("r", function(d) {
            return radius(d.weight)
        } )
        .attr("fill", "#00E5FF");


    nodes.exit().remove();
}
