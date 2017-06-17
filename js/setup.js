
// var appState = {
//   "markers": [L.marker([39.9522, -75.1639])],
//   "data": undefined,
//   "numericField1": undefined,
//   "numericField2": undefined,
//   "booleanField": undefined,
//   "stringField": undefined
// };

// Set up the map and basic layer (parcel)
require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/renderers/SimpleRenderer",
     "esri/symbols/PolygonSymbol3D",
     "esri/symbols/ExtrudeSymbol3DLayer",
     "esri/widgets/Legend",
    "dojo/domReady!"
  ], function(
    Map, SceneView, FeatureLayer, SimpleRenderer, PolygonSymbol3D,
    ExtrudeSymbol3DLayer, Legend
  ){
    // basic setting
    var map = new Map({
      basemap: "topo",
      ground: "world-elevation"
    });
    var view = new SceneView({
      container: "viewDiv",     // Reference to the scene div created in step 5
      map: map,                 // Reference to the map object created before the scene
      scale: 5000,          // Sets the initial scale to 1:50,000,000
      center: [-75.1652, 39.9526]  // Sets the center point of view with lon/lat
    });
    // imported hosted layer
    var fl = new FeatureLayer({
      url: 'http://services7.arcgis.com/RlQc2aMJR16YTTNE/arcgis/rest/services/finalparcel_ys/FeatureServer'
    });
    map.add(fl);  // adds the layer to the map
  });
