var http = require('http');

function Walkscore () {
}

Walkscore.prototype.version = '1.0.0';

Walkscore.prototype.getWalkScore = function (addr, lat, lng) {

  return rp('http://api.walkscore.com/score?'
    + 'format=json'
    + '&address=' + addr
    + '&lat=' + lat
    + '&lon=' + lng
    + '&wsapikey={APIKEY}')
    .then(function (res) {
      return JSON.parse(res);
    }).catch(function (err) {
      return err;
    });
};

Walkscore.prototype.getTransitScore = function (city, lat, lng) {
  return rp('http://transit.walkscore.com/transit/score/?'
    + 'lat=' + lat
    + '&lon=' + lng
    + '&city=' + city
    + '&country=CA&wsapikey={APIKEY}')
    .then(function (res) {
      return JSON.parse(res);
    }).catch(function (err) {
      return err;
    });
};

exports = module.exports = Walkscore;
