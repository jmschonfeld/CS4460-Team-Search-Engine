# CS4460-Team-Search-Engine

## Design of the System
This system is based in the `index.html` file. This file contains many `div` elements that act as placeholders for each element of the visualization (`#bubbles`, `#map`, `#relatedTable`, and `#legend`). Each of these elements is setup and controlled by a javascript file (`bubbles.js`, `map.js`, `table.js`, or `legend.js`). These individual javascript files load any necessary datasets, and create the visualization element using D3. They also offer any necessary update methods (ex. `updateLegend`) to call when the data changes. The `index.html` file also has a `#slider` element controlled by `slider.js` that allows the user to select a specific week during a timeframe. This slider has a callback that can be set using the `setSliderCallback` function that is called whenever the data is updated. Finally the tabs at the top each trigger the `openTab` method when the user selects a tab. All of this functionality is tied together by the central `index.js` that listens to changes from the `openTab` and slider callback functions and then spreads that information to each of the bubble, map, table, and legend update functions.


## Running the Code
The system is completely contained within this git repository. The `data_collection` repository contains a python script called `collect.py` that is used to download and create the necessary data sets. These data sets have already been created and running this script is not necessary unless the data needs to be updated.

The main visualization can be loaded by visiting `index.html` on a web server hosting this site. This site is running live on the web at http://jeremy.schonfeld.net/CS4460-Team-Search-Engine.