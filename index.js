var currentTab = undefined;
var tabIDsToDataTags = {
  Obesity: "obesity",
  Diet: "diet",
  Exercise: "exercise",
  Disease: "disease",
  Cancer: "cancer"
}


var mostRecentSliderDate = undefined;
var sliderChanged = function(inputDate) {
  date = inputDate || mostRecentSliderDate; // Use the input date, or fallback to the most recent date if undefined
  mostRecentSliderDate = inputDate || mostRecentSliderDate;

  if (date && currentTab) {
    if (typeof updateBubbles === 'function') {
      updateBubbles(currentTab, date);
    } else {
      console.warn("bubble.js not loaded - unable to update bubbles");
    }
    if (typeof updateMap === 'function') {
      updateMap(currentTab, date);
    } else {
      console.warn("map.js not loaded - unable to update map");
    }
    if (typeof updateTable === 'function') {
      updateTable(currentTab, date);
    } else {
      console.warn("table.js not loaded - unable to update table");
    }
    if (typeof updateLegend === 'function') {
      updateLegend(currentTab, date);
    } else {
      console.warn("legend.js not loaded - unable to update legend");
    }
  }
}
if (typeof setSliderCallback === 'function') {
  setSliderCallback(sliderChanged);
} else {
  console.warn("slider.js not loaded - unable to set slider callback");
}




function openTab(tabID) {
  // Declare all variables
  var i, tabcontent, tablinks;

  currentTab = tabIDsToDataTags[tabID];

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabID + "-button").className += " active";

  // Reset data by calling a slider change using the most recent date
  sliderChanged(undefined);
}

// Start by selecting the default tab of Obesity
openTab('Obesity');