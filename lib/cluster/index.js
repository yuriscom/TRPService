var Geometry = require(PATH + '/lib/geometry');

function Cluster () {

  this.offset = 268435456;
  this.radius = 85445659.4471;
  /* $offset / pi() */
  this.distance = 15;
}

exports = module.exports = Cluster;

Cluster.prototype.clusterize = function (markers, zoom) {
  var clustered = [];
  clustered.markers = [];
  clustered.clusters = [];
  var self = this;
  this.distance = (22 - zoom) * (22 - zoom);

  var compareDistance = function (target, index) {
    var pixels = self.pixelDistance(marker.lat, marker.lng, target.lat, target.lng, zoom);
    if (self.distance > pixels) {
      cluster.push(target);
      return false;
    }
    return true;
  };

  /* Loop until all markers have been compared. */
  while (markers.length) {
    var marker = markers.pop();
    var cluster = [];

    /* Compare against all markers which are left. */
    markers = _.filter(markers, compareDistance);

    /* If a marker has been added to cluster, add also the one  */
    /* we were comparing to and remove the original from array. */
    if (cluster.length > 0) {
      cluster.push(marker);
      var polygon = new Geometry.Polygon(cluster);
      var centroid = polygon.boundingBoxCentroid();
      clustered.clusters.push({label: cluster.length, lat: centroid.lat, lng: centroid.lng, listings: cluster});
    } else {
      clustered.markers.push(marker);
    }

  }

  return clustered;

};

// Calculates a distance between two points on earth
Cluster.prototype.haversineDistance = function (lat1, lng1, lat2, lng2) {
  var latd = _.deg2rad(lat2 - lat1);
  var lngd = _.deg2rad(lng2 - lng1);
  var a = Math.pow(Math.sin(latd / 2), 2) +
      Math.cos(_.deg2rad(lat1)) * Math.cos(_.deg2rad(lat2)) *
        Math.pow(Math.sin(lngd / 2), 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return 6371.0 * c;
};

Cluster.prototype.lngToX = function (lng) {
  return Math.round(this.offset + this.radius * lng * Math.PI / 180);
};

Cluster.prototype.latToY = function (lat) {
  return Math.round(this.offset - this.radius *
    Math.log((1 + Math.sin(lat * Math.PI / 180)) /
      (1 - Math.sin(lat * Math.PI / 180))) / 2
  );
};

Cluster.prototype.pixelDistance = function (lat1, lng1, lat2, lng2, zoom) {
  var x1 = this.lngToX(lng1);
  var y1 = this.latToY(lat1);

  var x2 = this.lngToX(lng2);
  var y2 = this.latToY(lat2);

  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)) >> (21 - zoom);
};
