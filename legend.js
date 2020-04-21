// Used to set the topic and date if the update function is called before the json is loaded
defaultTopicLegend = undefined;
defaultDateLegend = undefined;

datasetLegend = undefined;

// Updates the vizualization with a new topic and date
function updateLegend(topic, date) {
  if (!datasetLegend) {
    defaultTopicLegend = topic;
    defaultDateLegend = date;
  } else {
    updateLegend_active(topic, date);
  }
}

tbodyLegend = undefined;


d3.json("data_collection/final_related_data.json").then(function(data) {
    // d3.select("#relatedTable").selectAll("p")
    //     .data(data)
    //     .enter()
    //     .append("p")
    //     .text(function(d, i) {return d});

    var table = d3.select("#legend").append('table').attr("class", "table table-striped table-dark table-sm");
    var thead = table.append('thead');
    tbodyLegend = table.append('tbody');

    // append the header row
    thead.append('tr')
      .selectAll('th')
      .data(["Legend"]).enter()
      .append('th')
        .text(function (column) { return column; });

     datasetLegend = data;

    if (defaultTopicLegend && defaultDateLegend) {
        // Call the update function if it was called before the data was loaded
        updateLegend_active(defaultTopicLegend, defaultDateLegend);
    }
    console.log("[LEGEND] NOTICE: Data set loaded successfully");

});

function updateLegend_active(topic, date) {
    if (!datasetLegend) {
        console.error("[LEGEND] ERROR: Called updateLegend_active() before dataset has loaded. Please wait until D3 has loaded the dataset before calling updateLegend_active().");
        return;
    }

  if (typeof formatBubbleData !== 'function') {
    console.warn("[LEGEND] bubble.js not loaded - unable to format data to populate legend");
  } else {
    tabulateLegend(formatBubbleData(datasetLegend, topic, date));
  }
}

function compare( c1, c2 ) {
  if ( c1.value < c2.value ){
    return 1;
  }
  if ( c1.value > c2.value ){
    return -1;
  }
  return 0;
}   

function tabulateLegend(data) {
  var srt = data.children.sort(compare);
  var a = ["", "", "", "", ""];
  for (var i = 0; i < Math.min(srt.length, a.length); i++) {
    a[i] = srt[i];
  }
  console.log(a);

  // create a row for each object in the data
  var nodes = tbodyLegend.selectAll('tr')
    .data(a);
  var nodesEnter = nodes.enter().append('tr');

  nodesEnter.append('td').attr("height", "30px");

  var update = nodes.merge(nodesEnter);

  // create a cell in each row for each column
  var td = update.select('td');
      td.style("color", function (d) {
        return bubbleScaleColor(d.topic);
      });
      td.text(function (d) { return d.topic; });

  nodes.exit().remove();
}

