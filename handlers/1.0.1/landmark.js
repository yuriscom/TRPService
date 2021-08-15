var http = require('http')
  , when = require('when')
  ;

function Landmark () {
  this.lat = '';
  this.lng = '';
  this.num = '';
  this.types =
  {
    stops: [ 'subway_station|train_station|bus_station' ],
    stores: [ 'grocery_or_supermarket|convenience_store|shopping_mall' ]
  };
}

Landmark.prototype.version = '1.0.1';

Landmark.prototype.getNearbyByBounds = function (bounds, num, types) {

  if (num === undefined) {
    this.num = 5;
  } else {
    this.num = Math.min(100, num);
  }

  bounds = bounds.split(',');
  this.lat = bounds[0];
  this.lng = bounds[1];

  if (types === undefined) {
    types = this.types;
  }

  var promises = [];
  var placesParams = [];

  for (var key in types) {
    var place = types[key];
    for (var val in place) {
      placesParams = this.getPlaces(key, place[val]);
    }
    promises.push(placesParams);
  }

  return when.all(promises).then(function (results) {
    return results;
  });

};

Landmark.prototype.getDistance = function (latitudeTo, longitudeTo) {

  var self = this
    , earthRadius = 6371
    , latDelta = self.toRadians(latitudeTo - self.lat)
    , lonDelta = self.toRadians(longitudeTo - self.lng)
    , a = Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
      Math.cos(self.toRadians(self.lat)) * Math.cos(self.toRadians(latitudeTo))
        * Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2)
    , angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return angle * earthRadius;
};

Landmark.prototype.toRadians = function (number) {
  return number * Math.PI / 180;
};

Landmark.prototype.getPlaces = function (key, placesParams) {

  var self = this;

  return rp('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + this.lat + ',' + this.lng +
    '&types=' + placesParams + '&rankby=distance&key={GOOGLE_CODE}')
    .then(function (res) {
      var object = {};
      res = JSON.parse(res);
      res.results = res.results.slice(0, 3);
      for (var geom in res.results) {
        var resLocation = res.results[geom].geometry.location;
        var distance = self.getDistance(resLocation.lat, resLocation.lng);
        res.results[geom].distance = distance.toFixed(2);
      }
      object[key] = res;

      return object;
    })
    .catch(console.error);
};

exports = module.exports = Landmark;
