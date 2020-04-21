// Used to set the topic and date if the update function is called before the json is loaded
defaultTopicTable = undefined;
defaultDateTable = undefined;

datasetTable = undefined;

// Updates the vizualization with a new topic and date
function updateTable(topic, date) {
  if (!datasetTable) {
    defaultTopicTable = topic;
    defaultDateTable = date;
  } else {
    updateTable_active(topic, date);
  }
}

tbody = undefined;


d3.json("data_collection/related_table_data_final.json").then(function(data) {
    // d3.select("#relatedTable").selectAll("p")
    //     .data(data)
    //     .enter()
    //     .append("p")
    //     .text(function(d, i) {return d});

    var table = d3.select("#relatedTable").append('table').attr("class", "table table-striped table-dark table-sm");
    var thead = table.append('thead');
    tbody = table.append('tbody');

    // append the header row
    thead.append('tr')
      .selectAll('th')
      .data(["Related Terms"]).enter()
      .append('th')
        .text(function (column) { return column; });

     datasetTable = data;

    if (defaultTopicTable && defaultDateTable) {
        // Call the update function if it was called before the data was loaded
        updateTable_active(defaultTopicTable, defaultDateTable);
    }
    console.log("[TABLE] NOTICE: Data set loaded successfully");

});

function updateTable_active(topic, date) {
    if (!datasetTable) {
        console.error("[TABLE] ERROR: Called updateTable_active() before dataset has loaded. Please wait until D3 has loaded the dataset before calling updateTable_active().");
        return;
    }
  tabulate(datasetTable[topic][date]);
}

function tabulate(data) {
    var a = ["", "", "", "", ""];
    for (var i = 0; i < data.length; i++) {
      a[i] = data[i];
    }

    // create a row for each object in the data
    var nodes = tbody.selectAll('tr')
      .data(a);
    var nodesEnter = nodes.enter().append('tr');

    nodesEnter.append('td').attr("height", "30px");

    var update = nodes.merge(nodesEnter);

    // create a cell in each row for each column
    update.select('td')
        .text(function (d) { return d; });

  nodes.exit().remove();
}

