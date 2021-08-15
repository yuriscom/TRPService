function Func () {
}

Func.prototype.requireDir = function (path, objects) {
  if (objects === undefined) {
    objects = [];
  }

  if (path.substr(-1) == '/') {
    path = path.substr(0, path.length - 1);
  }

  var fs = require('fs');

  var self = this;
  fs.readdirSync(path).forEach(function (file) {
    if (fs.lstatSync(path + '/' + file).isDirectory()) {
      var dir = file;
      objects[dir] = self.requireDir(path + '/' + dir);
    } else if (fs.lstatSync(path + '/' + file).isFile()) {
      if (file.slice(-3) !== ".js") {
        return;
      }
      var name = file.replace('.js', '');
      objects[name] = require(path + '/' + file);
    }
  });

  return objects;
};

Func.prototype.getSqlDate = function(date) {
  return date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' +
    ('0' + date.getDate()).slice(-2) + " " + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) +
    ':' + ('0' + date.getSeconds()).slice(-2);
}

Func.prototype.convertToWebId = function (name) {
  name = name.replace(/\W/g, ' ');
  name = _.trim(name);
  name = name.replace(/\s+/g, '-');
  name = name.toLowerCase();
  return name;
};

Func.prototype.isInt = function (value) {
  return !isNaN(value) &&
    parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
};

Func.prototype.ucFirst = function (str) {
  console.log(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
};

Func.prototype.roundPrice = function (price) {
  if (isNaN(price) || price === 0) {
    return '0';
  }
  var suffix = 'K';
  price = parseFloat(price);
  if (price >= 950000) {
    suffix = 'M';
    price = Math.round(price / 100000) / 10;
    if (price % 1 === 0) {
      Math.round(price);
    }
  } else {
    price = Math.round(price / 1000);
  }
  return price + suffix;
};

Func.prototype.createPolygonFromBB = function (lat1, lng1, lat2, lng2) {
  return 'polygon(('
    + lng1 + ' ' + lat1 + ', '
    + lng1 + ' ' + lat2 + ', '
    + lng2 + ' ' + lat2 + ', '
    + lng2 + ' ' + lat1 + ', '
    + lng1 + ' ' + lat1
    + '))';
};


Func.prototype.debug_backtrace = function() {
  console.log("\n\n");
  console.trace();
  console.log("\n\n");
}


/*
 "envelope": {
 "type": "Polygon",
 "coordinates": [
 [
 [
 -79.6393024059999,
 43.5810698660001
 ],
 [
 -79.1154737479999,
 43.5810698660001
 ],
 [
 -79.1154737479999,
 43.855392888
 ],
 [
 -79.6393024059999,
 43.855392888
 ],
 [
 -79.6393024059999,
 43.5810698660001
 ]
 ]
 ]
 },
 */
Func.prototype.getCoordsFromEnvelope = function (envelope) {
  if (envelope === null || !_.has(envelope, 'coordinates')) {
    return {};
  } else {
    envelope = envelope.coordinates;
    return {
      // we want x = lat, y = lng
      x1: envelope[0][2][1],
      y1: envelope[0][2][0],
      x2: envelope[0][0][1],
      y2: envelope[0][0][0]
    };
  }
};

Func.prototype.microtime = function (getAsFloat) {
  //  discuss at: http://phpjs.org/functions/microtime/
  // original by: Paulo Freitas
  //   example 1: timeStamp = microtime(true);
  //   example 1: timeStamp > 1000000000 && timeStamp < 2000000000
  //   returns 1: true

  var now = new Date()
    .getTime() / 1000;
  var s = parseInt(now, 10);

  return (getAsFloat) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
};

Func.prototype.deg2rad = function (angle) {
  return (angle / 180) * Math.PI;
};

Func.prototype.arrayRemove = function (ar, from, to) {
  var rest = ar.slice((to || from) + 1 || ar.length);
  ar.length = from < 0 ? ar.length + from : from;
  ar.push.apply(ar, rest);
  return ar;
};

Func.prototype.randomString = function (length) {
  var result = '';
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (var i = length; i > 0; --i){
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return result;
};

Func.prototype.isset = function(obj /*, level1, level2, ... levelN*/) {
  var args = Array.prototype.slice.call(arguments, 1);

  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}

Func.prototype.naturalSortObj = function (objectsAr, $attribute) {
  return objectsAr.sort(function (a,b) {
    function chunkify(t) {
      var tz = [], x = 0, y = -1, n = 0, i, j;

      while (i = (j = t.charAt(x++)).charCodeAt(0)) {
        var m = (i == 46 || (i >=48 && i <= 57));
        if (m !== n) {
          tz[++y] = "";
          n = m;
        }
        tz[y] += j;
      }
      return tz;
    }

    var aa = chunkify(a[$attribute]);
    var bb = chunkify(b[$attribute]);

    for (x = 0; aa[x] && bb[x]; x++) {
      if (aa[x] !== bb[x]) {
        var c = Number(aa[x]), d = Number(bb[x]);
        if (c == aa[x] && d == bb[x]) {
          return c - d;
        } else return (aa[x] > bb[x]) ? 1 : -1;
      }
    }
    return aa.length - bb.length;
  });
};

var F = new Func();
exports = module.exports = F;