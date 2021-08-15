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
    + '&wsapikey=d5696400d12a4160fb5585c7a85c56d2')
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
    + '&country=CA&wsapikey=d5696400d12a4160fb5585c7a85c56d2')
    .then(function (res) {
      return JSON.parse(res);
    }).catch(function (err) {
      return err;
    });
};

exports = module.exports = Walkscore;