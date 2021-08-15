function Point (x, y) {
  this.x = x;
  this.y = y;
}

function Polygon (ar, format) {
  // need to have a polygon of unique points
  var self = this;
  self.isNewFormat = false;

  if(typeof format === 'undefined'){
    format = 'bounds';
  }

  var points;
  if(format === 'bounds'){
    points = ar.map(function (obj) {
      return obj.lat + ',' + obj.lng;
    });
  }else if(format === 'polygon'){
    if (_.has(ar, "coordinates")) {
      self.isNewFormat = true;
      ar = ar.coordinates;
    }
    var merged = [];
    merged = merged.concat.apply(merged, ar);
    points = merged.map(function (obj) {
      if (self.isNewFormat) {
        return obj[1] + ',' + obj[0];
      } else {
        return obj.y + ',' + obj.x;
      }
    });
  }


  points = _.uniq(points);

  this.points = points.map(function (point) {
    var latLngAr = point.split(',');
    return {lat: latLngAr[0], lng: latLngAr[1]};
  });
}

var Points = Point.prototype;
var Polygons = Polygon.prototype;

Points.get = function () {
  return {lat: this.x, lng: this.y};
};

Points.set = function (x, y) {
  this.x = x;
  this.y = y;
};

Polygons.area = function () {
  var area = 0,
    i,
    j,
    point1,
    point2;

  for (i = 0, j = this.points.length - 1; i < this.points.length; j = i, i++) {
    point1 = this.points[i];
    point2 = this.points[j];
    area += point1.lat * point2.lng;
    area -= point1.lng * point2.lat;
  }
  area /= 2;

  return area;
};

Polygons.centroid = function () {
  var x = 0,
    y = 0,
    i,
    j,
    f,
    point1,
    point2;

  var point = new Point();


  if (this.points.length > 2) {
    for (i = 0, j = this.points.length - 1; i < this.points.length; j = i, i++) {
      point1 = this.points[i];
      point2 = this.points[j];
      f = parseFloat(point1.lat) * parseFloat(point2.lng) - parseFloat(point2.lat) * parseFloat(point1.lng);
      x += (parseFloat(point1.lat) + parseFloat(point2.lat)) * f;
      y += (parseFloat(point1.lng) + parseFloat(point2.lng)) * f;
    }

    f = this.area() * 6;

    point.set(x / f, y / f);

  } else if (this.points.length == 2) {
    var lat = (parseFloat(this.points[0].lat) + parseFloat(this.points[1].lat)) / 2;
    var lng = (parseFloat(this.points[0].lng) + parseFloat(this.points[1].lng)) / 2;
    point.set(lat, lng);
  } else if (this.points.length == 1) {
    point.set(this.points[0].lat, this.points[0].lng);
  }

  return point.get();
};

Polygons.boundingBox = function () {
  var latAr = [];
  var lngAr = [];

  this.points.map(function (point) {
    latAr.push(parseFloat(point.lat));
    lngAr.push(parseFloat(point.lng));
  });

  var result = {
    x1: Math.max.apply(Math, latAr),
    y1: Math.max.apply(Math, lngAr),
    x2: Math.min.apply(Math, latAr),
    y2: Math.min.apply(Math, lngAr)
  };

  return result;

};

Polygons.boundingBoxCentroid = function () {
  var bb = this.boundingBox();
  return {"lat": (bb.x2 + bb.x1)/2, "lng": (bb.y2 + bb.y1)/2};
};


exports = module.exports = {Point: Point, Polygon: Polygon};
