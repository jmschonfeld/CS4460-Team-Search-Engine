var xScale = d3.scaleTime().domain([new Date(2015, 3, 15), new Date(2020, 3, 8)]).range([0, 500]);
var yScale = d3.scaleLinear().domain([0, 100]).range([0, 500]);

var obesitySVG = d3.select("#obesity-chart");
var obesityChart = obesitySVG.append('g').attr('transform', 'translate(75, 50)');
obesityChart.append('g').attr('class', 'x axis').attr('transform', 'translate(0, 500)').call(d3.axisBottom(xScale));
obesityChart.append('g').attr('class', 'y axis').attr('transform', 'translate(-25, 0)').call(d3.axisLeft(yScale));
obesityChart.append('text').attr('class', 'label').attr('transform', 'translate(250, 540)').text("Year");
obesityChart.append('text').attr('class', 'label').attr('transform', 'translate(-50, 225) rotate(-90)').text("Popularity");
obesitySVG.append('text').attr('class', 'label').attr('transform', 'translate(200, 20)').text("Obesity Search Popularity by Year");

var dietSVG = d3.select("#diet-chart");
var dietChart = dietSVG.append('g').attr('transform', 'translate(75, 50)');
dietChart.append('g').attr('class', 'x axis').attr('transform', 'translate(0, 500)').call(d3.axisBottom(xScale));
dietChart.append('g').attr('class', 'y axis').attr('transform', 'translate(-25, 0)').call(d3.axisLeft(yScale));
dietChart.append('text').attr('class', 'label').attr('transform', 'translate(250, 540)').text("Year");
dietChart.append('text').attr('class', 'label').attr('transform', 'translate(-50, 225) rotate(-90)').text("Popularity");
dietSVG.append('text').attr('class', 'label').attr('transform', 'translate(200, 20)').text("Diet Search Popularity by Year");

var exerciseSVG = d3.select("#exercise-chart");
var exerciseChart = exerciseSVG.append('g').attr('transform', 'translate(75, 50)');
exerciseChart.append('g').attr('class', 'x axis').attr('transform', 'translate(0, 500)').call(d3.axisBottom(xScale));
exerciseChart.append('g').attr('class', 'y axis').attr('transform', 'translate(-25, 0)').call(d3.axisLeft(yScale));
exerciseChart.append('text').attr('class', 'label').attr('transform', 'translate(250, 540)').text("Year");
exerciseChart.append('text').attr('class', 'label').attr('transform', 'translate(-50, 225) rotate(-90)').text("Popularity");
exerciseSVG.append('text').attr('class', 'label').attr('transform', 'translate(200, 20)').text("Exercise Search Popularity by Year");

var diseaseSVG = d3.select("#disease-chart");
var diseaseChart = diseaseSVG.append('g').attr('transform', 'translate(75, 50)');
diseaseChart.append('g').attr('class', 'x axis').attr('transform', 'translate(0, 500)').call(d3.axisBottom(xScale));
diseaseChart.append('g').attr('class', 'y axis').attr('transform', 'translate(-25, 0)').call(d3.axisLeft(yScale));
diseaseChart.append('text').attr('class', 'label').attr('transform', 'translate(250, 540)').text("Year");
diseaseChart.append('text').attr('class', 'label').attr('transform', 'translate(-50, 225) rotate(-90)').text("Popularity");
diseaseSVG.append('text').attr('class', 'label').attr('transform', 'translate(200, 20)').text("Disease Search Popularity by Year");

var cancerSVG = d3.select("#cancer-chart");
var cancerChart = cancerSVG.append('g').attr('transform', 'translate(75, 50)');
cancerChart.append('g').attr('class', 'x axis').attr('transform', 'translate(0, 500)').call(d3.axisBottom(xScale));
cancerChart.append('g').attr('class', 'y axis').attr('transform', 'translate(-25, 0)').call(d3.axisLeft(yScale));
cancerChart.append('text').attr('class', 'label').attr('transform', 'translate(250, 540)').text("Year");
cancerChart.append('text').attr('class', 'label').attr('transform', 'translate(-50, 225) rotate(-90)').text("Popularity");
cancerSVG.append('text').attr('class', 'label').attr('transform', 'translate(200, 20)').text("Cancer Search Popularity by Year");



d3.json("/data_collection/data.json").then(function(data) {

  var colors = ['green', 'blue'];

  var obesityData = data["obesity"];
  var obesityCircles = obesityChart.selectAll('circle');
  Object.keys(obesityData).forEach((key, index) => {
      obesityCircles.data(obesityData[key])
      .enter()
      .append('circle')
      .attr('cx', function(d) {
        return xScale(Date.parse(d['date']));
      })
      .attr('cy', function(d) {
        return 500 - yScale(d['val']);
      })
      .attr('r', 2)
      .attr('fill', colors[index]);
      obesityChart.append('text').attr('class', 'label').attr('transform', 'translate(350, ' + (10 + index * 25) + ')').attr('style', 'fill: ' + colors[index] + ';').text(key);
  });

  var dietData = data["diet"];
  var dietCircles = dietChart.selectAll('circle');
  Object.keys(dietData).forEach((key, index) => {
      dietCircles.data(dietData[key])
      .enter()
      .append('circle')
      .attr('cx', function(d) {
        return xScale(Date.parse(d['date']));
      })
      .attr('cy', function(d) {
        return 500 - yScale(d['val']);
      })
      .attr('r', 2)
      .attr('fill', colors[index]);
      dietChart.append('text').attr('class', 'label').attr('transform', 'translate(350, ' + (10 + index * 25) + ')').attr('style', 'fill: ' + colors[index] + ';').text(key);
  });

  var exerciseData = data["exercise"];
  var exerciseCircles = exerciseChart.selectAll('circle');
  Object.keys(exerciseData).forEach((key, index) => {
      exerciseCircles.data(exerciseData[key])
      .enter()
      .append('circle')
      .attr('cx', function(d) {
        return xScale(Date.parse(d['date']));
      })
      .attr('cy', function(d) {
        return 500 - yScale(d['val']);
      })
      .attr('r', 2)
      .attr('fill', colors[index]);
      exerciseChart.append('text').attr('class', 'label').attr('transform', 'translate(350, ' + (10 + index * 25) + ')').attr('style', 'fill: ' + colors[index] + ';').text(key);
  });

  var diseaseData = data["disease"];
  var diseaseCircles = diseaseChart.selectAll('circle');
  Object.keys(diseaseData).forEach((key, index) => {
      diseaseCircles.data(diseaseData[key])
      .enter()
      .append('circle')
      .attr('cx', function(d) {
        return xScale(Date.parse(d['date']));
      })
      .attr('cy', function(d) {
        return 500 - yScale(d['val']);
      })
      .attr('r', 2)
      .attr('fill', colors[index]);
      diseaseChart.append('text').attr('class', 'label').attr('transform', 'translate(350, ' + (10 + index * 25) + ')').attr('style', 'fill: ' + colors[index] + ';').text(key);
  });

  var cancerData = data["cancer"];
  var cancerCircles = cancerChart.selectAll('circle');
  Object.keys(cancerData).forEach((key, index) => {
      cancerCircles.data(cancerData[key])
      .enter()
      .append('circle')
      .attr('cx', function(d) {
        return xScale(Date.parse(d['date']));
      })
      .attr('cy', function(d) {
        return 500 - yScale(d['val']);
      })
      .attr('r', 2)
      .attr('fill', colors[index]);
      cancerChart.append('text').attr('class', 'label').attr('transform', 'translate(350, ' + (10 + index * 25) + ')').attr('style', 'fill: ' + colors[index] + ';').text(key);
  });
});