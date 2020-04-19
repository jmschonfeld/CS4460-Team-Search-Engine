// Setup the bubbles vizualization

var vizSize = 400,
    valueFormatter = d3.format(",d"),
    scaleColor = d3.scaleOrdinal(d3.schemeCategory10);

var bubble = d3.pack()
    .size([vizSize, vizSize])
    .padding(1.5);

// Attach an svg element to the #bubbles element

var svgBubble = d3.select("#bubbles").append("svg")
    .attr("width", vizSize)
    .attr("height", vizSize)
    .attr("class", "bubble");

// Formats the collected JSON data into data that can be used for d3.heirarchy
function formatData(data, key, date) {
  if (!(key in data)) {
    console.error("[BUBBLES] ERROR: attempted to show data for the topic '" + key + "' which is not a topic contained in the dataset.");
    return;
  }
  var children = [];
  for (const [subtopic, values] of Object.entries(data[key])) {
    if (!(date in values)) {
      console.warn("[BUBBLES] WARNING: Unable to find any data for '" + key + "' on '" + date + "'. This date was not listed in the dataset.");
    } else {
        children.push({topic: subtopic, value: values[date]});
    }
  }
  return {
    name: "ROOT",
    children: children
  };
}

// Used to set the topic and date if the update function is called before the json is loaded
defaultTopic = undefined;
defaultDate = undefined;

dataset = undefined;

// Updates the vizualization with a new topic and date
function updateBubbles(topic, date) {
  if (!dataset) {
    defaultTopic = topic;
    defaultDate = date;
  } else {
    updateBubbles_active(topic, date);
  }
}

function updateBubbles_active(topic, date) {
  if (!dataset) {
    console.error("[BUBBLES] ERROR: Called updateBubbles_active() before dataset has loaded. Please wait until D3 has loaded the dataset before calling updateBubbles_active().");
    return;
  }

  // Create heirarchical bubble data
  var root = d3.hierarchy(formatData(dataset, topic, date))
      .sum(function(d) { return d.value; })
      .sort(function(a, b) { return b.value - a.value; });

  bubble(root);

  // Setup the circles

  var nodes = svgBubble.selectAll('.node').data(root.children);
  var nodeEnter = nodes.enter()
      .append("g")
      .attr("class", "node");

  nodeEnter.append("title");
  nodeEnter.append("circle");
  nodeEnter.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .style("font-size", "10px");

  var update = nodes.merge(nodeEnter);

  // Update existing circles
  update.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

  update.select("text")
      .text(function(d) {
        if (d.data.topic.length >= d.r / 3) {
          return d.data.topic.substring(0, d.r/3).trim() + "...";
        } else {
          return d.data.topic;
        }
      });
  update.select("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) {
        return scaleColor(d.data.topic);
      });
  update.select("title")
      .text(function(d) { return d.data.topic + ": " + valueFormatter(d.value); });

  // Remove old circles
  nodes.exit().remove();
}

// Load the dataset
d3.json("data_collection/final_related_data.json").then(function(data) {
  dataset = data;

  if (defaultTopic && defaultDate) {
    // Call the update function if it was called before the data was loaded
    updateBubbles_active(defaultTopic, defaultDate);
  }
  console.log("[BUBBLES] NOTICE: Data set loaded successfully");
});
