// Set up the map and basic layer (parcel)
require([
  'esri/Map',

  'esri/views/MapView',
  'esri/views/SceneView',
  // sync views
  'esri/core/watchUtils',
  // layer type
  'esri/layers/FeatureLayer',
  // data visualization
  'esri/renderers/SimpleRenderer',
  'esri/renderers/ClassBreaksRenderer',
  "esri/renderers/smartMapping/creators/size",
  'esri/renderers/smartMapping/statistics/classBreaks',
  'esri/renderers/smartMapping/statistics/histogram',
  'esri/symbols/PolygonSymbol3D',
  'esri/symbols/ExtrudeSymbol3DLayer',
  'esri/symbols/SimpleFillSymbol',
  // widgets
  'esri/widgets/Legend',
  'esri/widgets/Zoom',
  'esri/widgets/Compass',
  'esri/widgets/ScaleBar',
  'esri/widgets/Search',
  'esri/widgets/Locate',
  'esri/widgets/LayerList',
  'esri/widgets/SizeSlider',
  'esri/widgets/BasemapToggle',

  'esri/core/lang',
  'dojo/on',
  'dojo/domReady!'
], function(
  // basemap
  Map, MapView, SceneView, watchUtils,
  FeatureLayer,
  SimpleRenderer, ClassBreaksRenderer, sizeRendererCreator, classBreaks, histogram,
  PolygonSymbol3D, ExtrudeSymbol3DLayer, SimpleFillSymbol,
  // widgets
  Legend, Zoom, Compass, ScaleBar, Search, Locate, LayerList, SizeSlider, BasemapToggle,
  lang, on
){
  // import all layers to be used in the app

  // 3D scene map
  // buidling layer - 3D scene
  // define renderer
  var bldgRenderer = new SimpleRenderer({
    symbol: new PolygonSymbol3D({
      symbolLayers: [new ExtrudeSymbol3DLayer()]
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
  // import hosted layer and the fields to be used
  var bldgLyr = new FeatureLayer({
    // url: 'https://services.arcgis.com/fLeGjb7u4uXqeF9q/ArcGIS/rest/services/LI_BUILDING_FOOTPRINTS/FeatureServer/0',
    // 5000 max per time
    url:'https://services.arcgis.com/fLeGjb7u4uXqeF9q/ArcGIS/rest/services/LI_BUILDING_FOOTPRINTS/FeatureServer/0/query?outFields=MAX_HGT&resultRecordCount=5000',
    renderer: bldgRenderer,
    // change the scale default in PHL open data
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

  // define 3d scene map
  var sceneMap = new Map({
    basemap: 'hybrid',
    ground: 'world-elevation',
    layers: [bldgLyr]
  });

  // 2D map
  // vacant layer - 2D map
  // define renderer
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
  // import hosted layer and the fields to be used
  var vacantparcelLyr = new FeatureLayer({
    url: 'https://services7.arcgis.com/RlQc2aMJR16YTTNE/arcgis/rest/services/vacantparcel/FeatureServer/0',
    renderer: vacantparcelRenderer,
  });
  // parcel layer - 2D map
  // define renderer
  var parcelRenderer = new ClassBreaksRenderer({
    field: 'refprice',
    defaultSymbol: new SimpleFillSymbol({
      color: 'grey',
      outline: {
        width: 0.3,
        color: 'grey'
      }
    }),
    defaultLabel: 'Missing Data',
  });
  // import hosted layer and the fields
  var parcelLyr = new FeatureLayer({
    url: 'https://services7.arcgis.com/RlQc2aMJR16YTTNE/arcgis/rest/services/finalparcel/FeatureServer/0',
    outFields: ['location', 'refprice'],
    popupTemplate: {
      title: 'PARCEL INFO',
      content: "<p>Address: {location}<br></br>Reference Price: ${refprice}<br></br><button class='mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored'><i class='material-icons'>add</i></button></p>",
      fieldInfos: [{
        fieldName: 'refprice',
        label: 'Reference Price',
        format: {
          digitSeparator: true,
          places: 0
        }
      }]
    },
    renderer: parcelRenderer,
  });

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
  classBreaks({
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
    _.each(breaks, function(datum){
      parcelRenderer.addClassBreakInfo(datum);
    })
  });

  // define 2d map
  var map = new Map({
    basemap: 'topo',
    ground: 'world-elevation',
    layers: [parcelLyr, vacantparcelLyr]
  });

  // after map has the layer info, create the 3D scene view
  var sceneView = new SceneView({
    container: 'sceneviewDiv',
    map: sceneMap,
    scale: 5000,
    center: [-75.16256149898815, 39.982102298576656],
  });
  sceneView.then(function() {
    sceneView.ui.remove('attribution')
    sceneView.ui.add([
      {
        component: new BasemapToggle({
          view: sceneView,
          nextBasemap: 'gray-vector',
        }),
        position: 'top-right',
      }
    ])
  })


  // after map has the layer info, create the 2D map view (main)
  var mapView = new MapView({
    container: 'mapviewDiv',
    map: map,
    scale: 5000,
    center: [-75.16256149898815, 39.982102298576656],
    components: ['attribution']
  });

  mapView.then(function() {
    // manually construct to control the order
    mapView.ui.empty('top-left');
    // add the ui components
    console.log('ready');
    // configure slider
    // configure params for size renderer generator
    var sizeParams = {
      layer: parcelLyr,
      basemap: map.basemap,
      field: "refprice",
      legendOptions: {
        title: "Query Slider"
      },
      minValue: 69100
    };
    // initialize slider params
    var sliderParams = {
      container: "slider"
    };

    //use sizeRendererCreator to configure slider stats and histogram
    sizeRendererCreator.createContinuousRenderer(sizeParams)
    .then(function(res) {
      sliderParams.statistics = res.statistics;
      sliderParams.visualVariable = lang.clone(res.visualVariables[0]);
      return histogram({
        layer: parcelLyr,
        field: sizeParams.field,
        minValue: sizeParams.minValue
      });
    })
    .then(function(histogram) {
      // when the promise resolves, set the histogram in the slider parameters
      sliderParams.histogram = histogram;
      // construct new sizeslider
      sizeSlider = new SizeSlider(sliderParams);
      mapView.ui.add([
        {
          component: new Search({ view: mapView }),
          position: "top-left",
          index: 0,
        }, {
          component: new Locate({ view: mapView }),
          position: "top-left",
          index: 1,
        }, {
          component: new Zoom({ view: mapView }),
          position: "top-left",
          index: 2,
        }, {
          component: new Compass({ view: mapView }),
          position: "top-left",
          index: 3,
        }, {
          component: new Legend({
            view: mapView,
            layerInfos: [{
              // parcel layer
              layer: map.layers.getItemAt(0),
              title: 'Price Range'
            }],
          }),
          position: "bottom-left",
          index: 0,
        }, {
          component: sizeSlider,
          position: "bottom-left",
          index: 1,
        }, {
          component: new ScaleBar({
            view: mapView,
            unit: 'dual'
          }),
          position: "bottom-left",
          index: 2,
        },
      ]);
      mapView.ui.add("sliderDiv", "bottom-left");
      // when the user slides the handle(s), update the renderer
      // with the updated color visual variable object

      // on(sizeSlider, "handle-value-change", function() {
      //   var renderer = parcelLyr.renderer.clone();
      //   renderer.visualVariables = [lang.clone(sizeSlider.visualVariable)];
      //   parcelLyr.renderer = renderer;
      // });
    });


  });

  mapView.on('click', function(evt){
    var screenPoint = {
      x: evt.x,
      y: evt.y
    };
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
