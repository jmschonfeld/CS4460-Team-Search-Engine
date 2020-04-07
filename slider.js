var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%m/%d/%y");
var parseDate = d3.timeParse("%m/%d/%y");

var startDate;
var endDate;

var margin = {top:50, right:50, bottom:0, left:50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#slider")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);


d3.json("/data_collection/data.json").then(function(data) {

  var dateList = data['obesity']['childhood obesity'];
  startDate = new Date(dateList[0]['date']);
  endDate = new Date(dateList[dateList.length -1]['date']);

  var textValue = startDate;

  var moving = false;
  var currentValue = 0;
  var currentIndex = 0;
  var targetValue = width;

  var playButton = d3.select("#play-button");

  var x = d3.scaleTime()
      .domain([startDate, endDate])
      .range([0, targetValue])
      .clamp(true);

  var index = d3.scaleLinear()
      .domain([0, dateList.length])
      .range([0, targetValue])
      .clamp(true);

  var slider = svg.append("g")
      .attr("class", "slider")
      .attr("transform", "translate(" + margin.left + "," + height/5 + ")");

  slider.append("line")
      .attr("class", "track")
      .attr("x1", x.range()[0])
      .attr("x2", x.range()[1])
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-inset")
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-overlay")
      .call(d3.drag()
          .on("start.interrupt", function() { slider.interrupt(); })
          .on("start drag", function() {
            currentValue = d3.event.x;
            update(x.invert(currentValue));
          })
      );

  slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
      .data(x.ticks(10))
      .enter()
      .append("text")
      .attr("x", x)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .text(function(d) { return formatDateIntoYear(d); });

  var handle = slider.insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9);

  var label = slider.append("text")
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .text(formatDate(startDate))
      .attr("transform", "translate(0," + (-25) + ")")


  //adding text element to svg
  var text = svg.append("text")
                .text(textValue)
                .attr("x", 150)
                .attr("y", 150)

  function update(h, i) {
    // update position and text of label according to slider scale
    handle.attr("cx", x(h));
    label
      .attr("x", x(h))
      .text(formatDate(h));
    //Displaying text to page
    text.text(h);
  }

});


