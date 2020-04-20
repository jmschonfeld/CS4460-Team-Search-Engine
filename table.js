
d3.json("data_collection/related_table_data.json").then(function(data) {
    // d3.select("#relatedTable").selectAll("p")
    //     .data(data)
    //     .enter()
    //     .append("p")
    //     .text(function(d, i) {return d});

  function tabulate(data, columns) {
        var table = d3.select("#relatedTable").append('table')
        var thead = table.append('thead')
        var tbody = table.append('tbody');

        // append the header row
        thead.append('tr')
          .selectAll('th')
          .data(columns).enter()
          .append('th')
            .text(function (column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll('tr')
          .data(data)
          .enter()
          .append('tr');

        // create a cell in each row for each column
        var cells = rows.selectAll('td')
          .data(data)
          .enter()
          .append('td')
            .text(function (d) { return d; });

      return table;
    }

    test_data = data['cancer']['04/19/2015'];
    tabulate(test_data, ["Related Terms"]);

});

