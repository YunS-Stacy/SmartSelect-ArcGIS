// store global function
var capStr = function(str) {
  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
};

var getComps = function (zpid) {
  return new Promise(function (resolve, reject) {
    const params = `zws-id=X1-ZWz19eddsdp2bv_1r7kw&zpid=${zpid}&count=1`;
    const endpoint = `https://cors-anywhere.herokuapp.com/www.zillow.com/webservice/GetDeepComps.htm?`;
    fetch(`${endpoint}${params}`)
    .then(res => res.text())
    .catch(err => reject(err))
    .then(res => {
      var parser = new DOMParser();
      var result = parser.parseFromString(res, 'text/xml');
      if (result.getElementsByTagName('code')[0].innerHTML != 0 ){
        const snackbarContainer = document.querySelector('#compsError');
        const showToastButton = document.querySelector('#demo-show-toast');
          const data = {message: 'Sorry, no comps are found!'};
          snackbarContainer.MaterialSnackbar.showSnackbar(data);
      } else {
        appState.compsFeature[0] = {
          longitude: Number(result.getElementsByTagName('longitude')[1].innerHTML),
          latitude: Number(result.getElementsByTagName('latitude')[1].innerHTML),
          attributes: {
            objectID: 1,
            address: result.getElementsByTagName('street')[1].innerHTML,
            soldDate: result.getElementsByTagName('lastSoldDate')[0].innerHTML,
            soldPrice: Number(result.getElementsByTagName('lastSoldPrice')[0].innerHTML),
            zestimate: Number(result.getElementsByTagName('amount')[1].innerHTML),
            valueLow: Number(result.getElementsByTagName('low')[1].innerHTML),
            valueHigh: Number(result.getElementsByTagName('high')[1].innerHTML),
            monthlyTrend: result.getElementsByTagName('valueChange')[1].innerHTML > 0 ? 'Price Up' : 'Price Down'
          },
        }
      };
      document.querySelector('#infoTable').style.visibility='visible';
      document.querySelector('#infoText').innerHTML=
          `<strong>Address: </strong>${appState.compsFeature[0].attributes.address}
          <strong>Last Sold Price: </strong>$${appState.compsFeature[0].attributes.soldPrice}<em>  (${appState.compsFeature[0].attributes.soldDate})</em>
          <strong>Zestimate: </strong>$${appState.compsFeature[0].attributes.zestimate}
          <strong>Value Range: </strong>$${appState.compsFeature[0].attributes.valueLow} - $${appState.compsFeature[0].attributes.valueHigh}
          <strong>Monthly Trend: </strong>${appState.compsFeature[0].attributes.monthlyTrend}`
      resolve(result);
    })
    .catch(err => {
      reject(err);
    })
  });
};
