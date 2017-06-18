// Set up the map and basic layer (parcel)
require([
  'esri/Map',

  'esri/views/MapView',
  'esri/views/SceneView',
  'esri/core/watchUtils',

  'esri/layers/FeatureLayer',
  'esri/renderers/SimpleRenderer',
  'esri/symbols/PolygonSymbol3D',
  'esri/symbols/ExtrudeSymbol3DLayer',
  'esri/renderers/ClassBreaksRenderer',
  'esri/symbols/SimpleFillSymbol',
  'esri/renderers/smartMapping/statistics/classBreaks',

  'esri/widgets/Legend',
  'dojo/domReady!'
], function(
  // basemap
  Map, MapView, SceneView, watchUtils,
  // layer
  FeatureLayer,
  // vacant parcel
  SimpleRenderer,
  PolygonSymbol3D,
  ExtrudeSymbol3DLayer,
  // parcel layer
  ClassBreaksRenderer, SimpleFillSymbol, classBreaks,
  // ui
  Legend,
){
  // basic setting
  var map = new Map({
    basemap: 'topo',
    ground: 'world-elevation',
  });

  var sceneMap = new Map({
    basemap: 'hybrid',
    ground: 'world-elevation',
  });

  // define renderer for vacant layer
  var vacantparcelRenderer = new SimpleRenderer({
    symbol: new SimpleFillSymbol({
      color: 'rgba(172, 172, 172, 0.7)',
      style: 'solid',
      outline: {
        width: 0.3,
        color: 'red'
      }
    }),
    label: 'Vacant Parcel'
  });
  // import hosted layer and the fields to be used in the 3D scene
  var vacantparcelLyr = new FeatureLayer({
    url: 'https://services7.arcgis.com/RlQc2aMJR16YTTNE/arcgis/rest/services/vacantparcel/FeatureServer/0',
    renderer: vacantparcelRenderer,
  });
  // add the layer
  sceneMap.add(vacantparcelLyr);

  // define renderer for building layer
  var bldgRenderer = new SimpleRenderer({
    symbol: new PolygonSymbol3D({
      symbolLayers: [new ExtrudeSymbol3DLayer()]  // creates volumetric symbols for polygons that can be extruded
    }),
    visualVariables: [{
      type: 'size',
      field: 'MAX_HGT',
      valueUnit: 'feet'
    }, {
      type: 'color',
      field: 'MAX_HGT',
      valueUnit: 'feet',
      stops: [
        {
          value: 0,
          color: 'rgba(255, 255, 255, 0.9)',
        },
        // 100 meter as high-rise
        {
          value: 328.084,
          color: 'rgba(251, 178, 23, 0.9)',
        }
      ]
    }]
  });
  // import hosted layer and the fields to be used in the 3D scene
  var bldgLyr = new FeatureLayer({
    // url: 'https://services.arcgis.com/fLeGjb7u4uXqeF9q/ArcGIS/rest/services/LI_BUILDING_FOOTPRINTS/FeatureServer/0',
    // 5000 max per time
    url:'https://services.arcgis.com/fLeGjb7u4uXqeF9q/ArcGIS/rest/services/LI_BUILDING_FOOTPRINTS/FeatureServer/0/query?outFields=MAX_HGT&resultRecordCount=5000',
    renderer: bldgRenderer,
    maxScale: 0,
    minScale: 0,
  });
  // var bldgLyr1 = new FeatureLayer({
  //   // url: 'https://services.arcgis.com/fLeGjb7u4uXqeF9q/ArcGIS/rest/services/LI_BUILDING_FOOTPRINTS/FeatureServer/0',
  //   url:'https://services.arcgis.com/fLeGjb7u4uXqeF9q/ArcGIS/rest/services/LI_BUILDING_FOOTPRINTS/FeatureServer/0/query?outFields=MAX_HGT&resultOffset=5000&resultRecordCount=5000',
  //   renderer: bldgRenderer,
  //   maxScale: 0,
  //   minScale: 0,
  // });
  // sceneMap.add(bldgLyr1);

  // add the layer
  sceneMap.add(bldgLyr);

  // define renderer for parcel layer
  var parcelRenderer = new ClassBreaksRenderer({
    field: 'refprice',
    defaultSymbol: new SimpleFillSymbol({
      color: 'grey',
      outline: {
        width: 0.3,
        color: 'grey'
      }
    }),
    defaultLabel: 'no data',
  });
  // import hosted layer and the fields to be used in the popup (2D map)
  var parcelLyr = new FeatureLayer({
    url: 'https://services7.arcgis.com/RlQc2aMJR16YTTNE/arcgis/rest/services/finalparcel/FeatureServer/0',
    outFields: ['location', 'refprice'],
    popupTemplate: {
      title: 'PARCEL INFO',
      content: "<p>Address: {location}<br></br>Reference Price: ${refprice}<br></br><button class='mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored'><i class='material-icons'>add</i></button></p>",
      fieldInfos: [{
        fieldName: 'refprice',
        format: {
          digitSeparator: true,
          places: 0
        }
      }]
    },
    renderer: parcelRenderer,
  });
  // add the layer
  map.add(parcelLyr);

  // define class break symbols
  var cl1 = new SimpleFillSymbol({
    color: 'rgba(12, 44, 132, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: 'rgba(12, 44, 132, 0.7)'
    },
  }),
  cl2 = new SimpleFillSymbol({
    color: 'rgba(34, 94, 168, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: 'rgba(34, 94, 168, 0.7)'
    },
  }),
  cl3 = new SimpleFillSymbol({
    color: 'rgba(29, 145, 192, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: 'rgba(29, 145, 192, 0.7)'
    },
  }),
  cl4 = new SimpleFillSymbol({
    color: 'rgba(65, 182, 196, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: 'rgba(65, 182, 196, 0.7)'
    },
  }),
  cl5 = new SimpleFillSymbol({
    color: 'rgba(12, 44, 132, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: 'rgba(127, 205, 187, 0.7)'
    },
  }),
  cl6 = new SimpleFillSymbol({
    color: 'rgba(254, 190, 18, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: 'rgba(254, 190, 18, 0.7)'
    },
  }),
  cl7 = new SimpleFillSymbol({
    color: 'rgba(238, 131, 110, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: 'rgba(238, 131, 110, 0.7)'
    },
  }),
  cl8 = new SimpleFillSymbol({
    color: 'rgba(232, 92, 65, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: 'rgba(232, 92, 65, 0.7)'
    },
  }),
  cl9 = new SimpleFillSymbol({
    color: 'rgba(219, 58, 27, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: 'rgba(219, 58, 27, 0.7)'
    },
  }),
  cl10 = new SimpleFillSymbol({
    color: 'rgba(170, 45, 23, 0.7)',
    style: 'solid',
    outline: {
      width: 0.3,
      color: 'rgba(170, 45, 23, 0.7)'
    },
  });
  var arrCl = [cl1, cl2, cl3, cl4, cl5, cl6, cl7, cl8, cl9, cl10]


  // classify the data by quantile
  var quant = new classBreaks({
    layer: parcelLyr,
    field: 'refprice',
    classificationMethod: 'quantile',
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
      parcelRenderer.addClassBreakInfo(datum);
    })
    // wrong: parcelRenderer.addClassBreakInfo(breaks);
  });


  // after map has the layer info, create the 3D scene view
  var sceneView = new SceneView({
    container: 'sceneviewDiv',
    map: sceneMap,
    scale: 5000,
    center: [-75.16256149898815, 39.982102298576656],
  });

  sceneView.then(function() {
    // get the first layer in the collection of operational layers in the WebMap
    // when the resources in the sceneView have loaded.
    var fl = sceneMap.layers.getItemAt(0);
    // add the legend
    var legend = new Legend({
      view: sceneView,
      layerInfos: [{
        layer: fl,
        title: 'Vacant Parcel'
      }]
    });


    // Add widget to the bottom right corner of the view
    sceneView.ui.add(legend, 'bottom-left');

  });

  // after map has the layer info, create the 2D map view (main)
  var mapView = new MapView({
    container: 'mapviewDiv',
    map: map,
    scale: 5000,
    center: [-75.16256149898815, 39.982102298576656],
  });

  mapView.then(function() {
    // get the first layer in the collection of operational layers in the WebMap
    // when the resources in the MapView have loaded.
    var fl = map.layers.getItemAt(0);
    // add the legend
    var legend = new Legend({
      view: mapView,
      layerInfos: [{
        layer: fl,
        title: 'Price Range'
      }],
    });
    // Add widget to the bottom right corner of the view
    mapView.ui.add(legend, 'bottom-left');

  });
  mapView.on('click', function(evt){
    var screenPoint = {
      x: evt.x,
      y: evt.y
    };
    console.log(evt);
    mapView.popup.watch('visible', function(visible) {
      console.log('popup visible: ', visible);
    });

  });

  /**
  * utility method that synchronizes the viewpoint of a view to other views
  */
  var synchronizeView = function(view, others) {
    others = Array.isArray(others) ? others : [others];

    var viewpointWatchHandle;
    var viewStationaryHandle;
    var otherInteractHandlers;
    var scheduleId;

    var clear = function() {
      if (otherInteractHandlers) {
        otherInteractHandlers.forEach(function(handle) {
          handle.remove();
        });
      }
      viewpointWatchHandle && viewpointWatchHandle.remove();
      viewStationaryHandle && viewStationaryHandle.remove();
      scheduleId && clearTimeout(scheduleId);
      otherInteractHandlers = viewpointWatchHandle =
      viewStationaryHandle = scheduleId = null;
    };

    var interactWatcher = view.watch('interacting,animation',
    function(newValue) {
      if (!newValue) {
        return;
      }
      if (viewpointWatchHandle || scheduleId) {
        return;
      }

      // start updating the other views at the next frame
      scheduleId = setTimeout(function() {
        scheduleId = null;
        viewpointWatchHandle = view.watch('viewpoint',
        function(newValue) {
          others.forEach(function(otherView) {
            otherView.viewpoint = newValue;
          });
        });
      }, 0);

      // stop as soon as another view starts interacting, like if the user starts panning
      otherInteractHandlers = others.map(function(otherView) {
        return watchUtils.watch(otherView,
          'interacting,animation',
          function(
            value) {
              if (value) {
                clear();
              }
            });
          });

          // or stop when the view is stationary again
          viewStationaryHandle = watchUtils.whenTrue(view,
            'stationary', clear);
          });

          return {
            remove: function() {
              this.remove = function() {};
              clear();
              interactWatcher.remove();
            }
          }
        };

        /**
        * utility method that synchronizes the viewpoints of multiple views
        */
        var synchronizeViews = function(views) {
          var handles = views.map(function(view, idx, views) {
            var others = views.concat();
            others.splice(idx, 1);
            return synchronizeView(view, others);
          });

          return {
            remove: function() {
              this.remove = function() {};
              handles.forEach(function(h) {
                h.remove();
              });
              handles = null;
            }
          }
        }

        // bind the views
        synchronizeViews([sceneView, mapView]);
      });
