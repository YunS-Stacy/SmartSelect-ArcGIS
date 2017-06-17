// Set up the map and basic layer (parcel)
require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer",
  "esri/renderers/ClassBreaksRenderer",
  "esri/symbols/SimpleFillSymbol",
  "esri/renderers/smartMapping/statistics/classBreaks",
  // "esri/symbols/PolygonSymbol3D",
  // "esri/symbols/ExtrudeSymbol3DLayer",
  "esri/widgets/Legend",
  "dojo/domReady!"
], function(
  // basemap
  Map, SceneView,
  // layer
  FeatureLayer, ClassBreaksRenderer, SimpleFillSymbol,
  classBreaks,
  // ui
  Legend,
){
  // basic setting
  var map = new Map({
    basemap: "topo",
    ground: "world-elevation"
  });
  var view = new SceneView({
    container: "viewDiv",
    map: map,
    scale: 5000,
    center: [-75.204117, 39.961009]
  });
  // define renderer
  var renderer = new ClassBreaksRenderer({
    field: "refprice",
    defaultSymbol: new SimpleFillSymbol({
      color: "grey",
      outline: {
        width: 0.3,
        color: "grey"
      }
    }),
    defaultLabel: "no data",
  });

  // imported hosted layer and the fields to be used in the popup
  var parcelLyr = new FeatureLayer({
    url: 'https://services7.arcgis.com/RlQc2aMJR16YTTNE/arcgis/rest/services/finalparcel_ys/FeatureServer/0',
    outFields: ['location', 'refprice'],
    popupTemplate: {
      title: "PARCEL INFO",
      content: "Address: {location}<br></br>Reference Price: ${refprice}",
      fieldInfos: [{
        fieldName: "refprice",
        format: {
          digitSeparator: true,
          places: 0
        }
      }]
    },
    renderer: renderer,
  });

  // define class break symbols
  var cl1 = new SimpleFillSymbol({
    color: 'rgba(12, 44, 132, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: "rgba(12, 44, 132, 0.7)"
    },
  }),
  cl2 = new SimpleFillSymbol({
    color: 'rgba(34, 94, 168, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: "rgba(34, 94, 168, 0.7)"
    },
  }),
  cl3 = new SimpleFillSymbol({
    color: 'rgba(29, 145, 192, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: "rgba(29, 145, 192, 0.7)"
    },
  }),
  cl4 = new SimpleFillSymbol({
    color: 'rgba(65, 182, 196, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: "rgba(65, 182, 196, 0.7)"
    },
  }),
  cl5 = new SimpleFillSymbol({
    color: 'rgba(12, 44, 132, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: "rgba(127, 205, 187, 0.7)"
    },
  }),
  cl6 = new SimpleFillSymbol({
    color: 'rgba(254, 190, 18, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: "rgba(254, 190, 18, 0.7)"
    },
  }),
  cl7 = new SimpleFillSymbol({
    color: 'rgba(238, 131, 110, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: "rgba(238, 131, 110, 0.7)"
    },
  }),
  cl8 = new SimpleFillSymbol({
    color: 'rgba(232, 92, 65, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: "rgba(232, 92, 65, 0.7)"
    },
  }),
  cl9 = new SimpleFillSymbol({
    color: 'rgba(219, 58, 27, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: "rgba(219, 58, 27, 0.7)"
    },
  }),
  cl10 = new SimpleFillSymbol({
    color: 'rgba(170, 45, 23, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: "rgba(170, 45, 23, 0.7)"
    },
  });
  var arrCl = [cl1, cl2, cl3, cl4, cl5, cl6, cl7, cl8, cl9, cl10]


  // classify the data by quantile
  var quant = new classBreaks({
    layer: parcelLyr,
    field: "refprice",
    classificationMethod: "quantile",
    minValue: 69100,
    maxValue: 600000,
    numClasses: 10,
  }).then(function(res){
    // class break infos that may be passed to the
    // constructor of a ClassBreaksRenderer
    var breaks = res.classBreakInfos;
    for (var i = 0; i < breaks.length; i++) {
      breaks[i].symbol = arrCl[i];
    };
    // right: add one object a time
    _.each(breaks, function(datum){
      renderer.addClassBreakInfo(datum);
    })
    // wrong: renderer.addClassBreakInfo(breaks);
  });
  // add the layer
  map.add(parcelLyr);
  view.on('click', function(evt){
    var screenPoint = {
      x: evt.x,
      y: evt.y
    };
    view.hitTest(screenPoint)
    .then(function(res){
      console.log(res);
      console.log(res.results[0].graphic)
      // do something with the result graphic
      var graphic = res.results[0].graphic;
      // $('canvas')[0].style.cursor = 'pointer';

    });

  });
  // add the legend
  var legend = new Legend({
    view: view,
    layerinfos: [
      {
        layer: parcelLyr,
        title: 'Price Range'
      }
    ]
  })
});
