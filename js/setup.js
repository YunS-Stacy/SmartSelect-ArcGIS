// store global variables
var appState = {
  mapView: undefined,
  compsLyr: undefined,
  compsFeature: [
    {//fake
      latitude: 0,
      longitude: 0,
      // longitude: 0,
      // latitude: 0,
      attributes: {
        objectID: 1,
        address: undefined,
        soldPrice: undefined,
        soldDate: undefined,
        zestimate: undefined,
        valueLow: undefined,
        valueHigh: undefined,
        monthlyTrend: undefined,
      }
    }
  ],
  compsLines: [],
  snackMessage: 'Sorry, no comps are found!',
  infoPts: {
    address: '',
    zpid: '',
  },
}
