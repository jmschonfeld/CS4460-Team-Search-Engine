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
  mostRecentSliderDate = inputDate;

  if (date && currentTab) {
    updateBubbles(currentTab, date);
  }
}
setSliderCallback(sliderChanged);




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