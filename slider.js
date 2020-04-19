var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%m/%d/%Y");
var parseDate = d3.timeParse("%m/%d/%y");

var sliderMargin = {top:50, right:50, bottom:0, left:50},
  sliderWidth = 960 - sliderMargin.left - sliderMargin.right,
  sliderHeight = 500 - sliderMargin.top - sliderMargin.bottom;


var sliderSVG = d3.select("#slider")
    .append("svg")
    .attr("width", sliderWidth + sliderMargin.left + sliderMargin.right)
    .attr("height", sliderHeight + sliderMargin.top + sliderMargin.bottom);

// Slider Callback Function
// Call setSliderCallback with a function. This function will be called every time the slider selects a new date
var sliderCallback = undefined;
function setSliderCallback(cbFunction) {
  sliderCallback = cbFunction;
}

function getSliderStartDate() {
  return formatDate(sliderStartDate);
}

d3.json("/data_collection/play_around.json").then(function(data) {


  var dateDict = data['obesity']['childhood obesity'];
  var startDate = new Date(dateDict['start_date']);
  var endDate = new Date(dateDict['end_date']);

  if (sliderCallback) {
    sliderCallback(formatDate(startDate));
  }

  var playButton = d3.select("#play-button");

  var x = d3.scaleTime()
      .domain([startDate, endDate])
      .range([0, sliderWidth])
      .clamp(true);

  var slider = sliderSVG.append("g")
      .attr("class", "slider")
      .attr("transform", "translate(" + sliderMargin.left + "," + sliderHeight/5 + ")");

  // Slider line
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
          var currentValue = d3.event.x;
          update(x.invert(currentValue));
        })
      );

  // Slider ticks
  slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(10))
      .enter()
      .append("text")
      .attr("x", x)
      .attr("y", 10)
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .text(function(d) { return formatDateIntoYear(d); });

  // Slider handle
  var handle = slider.insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9);

  // Date label
  var label = slider.append("text")
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .text(formatDate(startDate))
      .attr("transform", "translate(0," + (-25) + ")")
      .attr("font-size", "10px");

  function update(dateObj) {
    // Format date object into MM/DD/YYYY format
    var date = formatDate(dateObj);

    // update position and text of label according to slider scale
    handle.attr("cx", x(dateObj));
    label.attr("x", x(dateObj))
      .text(date);

    // Call the callback function (if set)
    if (sliderCallback) {
      sliderCallback(date);
    }
  }
});


