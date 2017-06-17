var resetMap = function() {
  _.each(appState.markers, function(marker, i) {
    map.removeLayer(marker);
  });
  appState.markers = [];
};

var getAndParseData = function() {
  // Filter, clean, and store data
  $.ajax('https://raw.githubusercontent.com/CPLN690-MUSA610/datasets/master/json/philadelphia-crime-snippet.json').done(function(result) {
    var parsed = JSON.parse(result);
    var numericCoords = _.filter(parsed, function(datum) {
      return typeof datum.Coordinates !== 'number';
    });
    appState.data = _.map(numericCoords, function(datum) {
      var latlongStrings = datum.Coordinates.replace('(', '').replace(')', '').replace(',', '').split(' ');
      var latlong = _.map(latlongStrings, function(str) { return parseFloat(str); });
      datum.coords = latlong;
      return datum;
    });
  });
};

var plotData = function() {
  var filterPredicate = function(datum) {
    var conditionStatus = true;
    if (appState.numericField1) { conditionStatus = conditionStatus && appState.numericField1 <= datum.PSA; }
    if (appState.numericField2) { conditionStatus = conditionStatus && appState.numericField2 >= datum.PSA; }
    if (appState.booleanField) { conditionStatus = conditionStatus && datum['UCR Code'] === 800; }
    if (appState.stringField) {
      conditionStatus = conditionStatus && datum['General Crime Category'].toUpperCase().includes(appState.stringField.toUpperCase());
    }
    return conditionStatus;
  };

  var filtered = _.filter(appState.data, filterPredicate);

  appState.markers = _.map(filtered, function(datum) {
    return L.marker(datum.coords).bindPopup(datum['General Crime Category']);
  });

  console.log("Attaching " + appState.markers.length + " markers to the map");
  _.each(appState.markers, function(marker) {
    marker.addTo(map);
  });
};
