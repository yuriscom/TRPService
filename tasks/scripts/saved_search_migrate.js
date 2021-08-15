var Sequelize = require('../../lib/sequelize')
  ;

var script = function (options, callback) {

  var Migrate = function () {
    this.sequelize = new Sequelize(
      options.database,
      options.username,
      options.password,
      _.extend(options, {logging: false})
    );

    this.chunks = 0;
    this.chunkSize = 50;
    //this.myMaxListeners = (this.chunkSize * 2);
    //require('events').EventEmitter.defaultMaxListeners = this,myMaxListeners;

    // init the object with hoods that don't have polygon
    this.oldHoodPoly = {
      1: Promise.resolve(boundsToPoly({
        x1: 41.676556,
        y1: -141.00187,
        x2: 83.0956562,
        y2: -52.620696399999986
      })), // Square One Mississauga
      3: Promise.resolve(boundsToPoly({
        x1: 43.5513955,
        y1: -79.63327700000002,
        x2: 43.5742024,
        y2: -79.60718099999997
      })), // Queensway West
      4: Promise.resolve(boundsToPoly({
        x1: 43.6071208,
        y1: -79.56916810000001,
        x2: 43.6599241,
        y2: -79.51286329999999
      })), // Etobicoke West Mall
      5: Promise.resolve(boundsToPoly({
        x1: 43.46820040000001,
        y1: -79.65839090000003,
        x2: 43.4714568,
        y2: -79.65449869999998
      })), // Wedgewood Park
      23: Promise.resolve(boundsToPoly({
        x1: 43.7647586,
        y1: -79.6476973,
        x2: 43.8339167,
        y2: -79.43200630000001
      })), // Hwy 7
      24: Promise.resolve(boundsToPoly({
        x1: 43.7647586,
        y1: -79.6476973,
        x2: 43.8339167,
        y2: -79.43200630000001
      })) // Hwy 7
    };

    // init the object with cities that don't have polygon
    this.oldCityPoly = {
      2: Promise.resolve(boundsToPoly({
        x1: 43.692711,
        y1: -79.58511290000001,
        x2: 43.8156051,
        y2: -79.29888410000001
      })), // North York
      5: Promise.resolve(boundsToPoly({
        x1: 43.58108470000001,
        y1: -79.63921900000003,
        x2: 43.7636909,
        y2: -79.4664017
      })), // Etobicoke
      6: Promise.resolve(boundsToPoly({
        x1: 43.671154,
        y1: -79.341341,
        x2: 43.8554447,
        y2: -79.11612860000002
      })), // Scarborough
      11: Promise.resolve(boundsToPoly({
        x1: 43.7583473,
        y1: -79.6287888,
        x2: 43.8069525,
        y2: -79.5787464
      })), // Woodbridge
      20: Promise.resolve(boundsToPoly({
        x1: 43.64744,
        y1: -79.5356888,
        x2: 43.7161541,
        y2: -79.41837090000001
      })), // York
      21: Promise.resolve(boundsToPoly({
        x1: 43.6813691,
        y1: -79.3783621,
        x2: 43.720377,
        y2: -79.28868109999996
      })), // East York
      40: Promise.resolve(boundsToPoly({
        x1: 49.19817700000001,
        y1: -123.224759,
        x2: 49.3140764,
        y2: -123.0230679
      })) // Vancouver
    };

    var versions = _.keys(handlers);
    var lastVersion = versions[versions.length - 1];
    this.SavedSearch = new handlers[lastVersion]['saved-search']();
  }

  Migrate.savePromises = [];

  var prot = Migrate.prototype;

  prot.run = function () {
    var self = this;
    var query = 'select count(1) as num from saved_search order by id asc';
    return this.sequelize.query(query).then(function (res) {
      var num = res[0].num;
      self.chunks = Math.ceil(num / self.chunkSize);
      //self.chunks = 1;
      return self.migrateChunk(0);
    })
  }

  prot.migrateChunk = function (chunk) {
    var self = this;
    chunk = chunk || 0;
    if (chunk > this.chunks - 1) {
      return null;
    }
    console.log("running chunk " + (chunk + 1) + " / " + self.chunks);
    var offset = this.chunkSize * chunk;

    var query = 'select * from saved_search order by id asc limit ' + offset + ', ' + this.chunkSize;
    //var query = 'select * from saved_search where id=65345';

    var trackInfoKeys = ['track_browser', 'track_browser_version', 'track_page_url', 'track_os', 'track_os_version', 'track_landing_url', 'track_http_referrer', 'track_ip', 'track_marketo_cookie'];

    var dataObj = {};
    var promises = [];
    return this.sequelize.query(query).then(function (results) {
      results.forEach(function (row) {

        if (row.id == 47605) {
          return;
        }


        try {
          var queries = JSON.parse(row.queries);
        } catch (e) {
          return;
        }

        if (!_.isArray(queries)) {
          return;
        }

        var query = queries[0];
        if (!_.has(query, 'type') || query.type != 'resale') {
          console.log("precon is not implemented yet: ss id " + row.id);
          return;
        }

        var data = {};
        dataObj[row.id] = data;
        var filters = query.filters;

        data.user_id = row.user_id;
        data.name = row.name;
        data.created_on = row.created_on;
        data.updated_on = row.updated_on;
        data.last_checked = row.last_checked;
        data.last_sent = row.last_sent;

        var flatFilters = {};
        _.keys(filters).forEach(function (filterIdx) {
          var filter = filters[filterIdx];
          var filterKey = _.keys(filter)[0];
          switch (filterKey) {
            case 'RESALE_COMMON_property_type':
              data.property_type = mapOldTypeToNew(filter[filterKey]);
              break;
            case 'COMMON_price_min':
              data.min_price = filter[filterKey];
              break;
            case 'COMMON_price_max':
              data.max_price = filter[filterKey];
              break;
            case 'COMMON_num_beds':
              data.beds = filter[filterKey];
              break;
            case 'COMMON_num_baths':
              data.baths = mapCOMMON_num_baths[filter[filterKey]] || '';
              break;
          }

          flatFilters[filterKey] = filter[filterKey];
        })

        trackInfoKeys.forEach(function (key) {
          if (query[key]) {
            data[key] = query[key];
          }
        })


        if (flatFilters['COMMON_hood']) {
          var hoodIds = flatFilters['COMMON_hood'].split(",");
          /*
           if (hoodIds.length > self.myMaxListeners) {
           console.log("exceeds " + row.id + ":" + hoodIds.length);
           self.myMaxListeners = hoodIds.length;
           require('events').EventEmitter.defaultMaxListeners = self.myMaxListeners;
           }
           */
          var myPromisesAr = [];
          hoodIds.forEach(function (id) {
            if (!self.oldHoodPoly[id]) {
              self.oldHoodPoly[id] = new Promise(function (resolve, reject) {

                self.sequelize.query("select astext(polygon) as poly from hood where id = " + id).then(function (polyHoodRes) {
                  if (polyHoodRes && polyHoodRes.length) {
                    return resolve(polyHoodRes[0].poly);
                  } else {
                    // bad data, it's probably city, not hood
                    if (hoodIds.length == 1) {
                      console.log("trying to fix bad data for hood id, ss: " + row.id);
                      if (!self.oldCityPoly[id]) {
                        self.sequelize.query("select astext(polygon) as poly from city where id = " + id).then(function (polyCityRes) {
                          if (polyCityRes && polyCityRes.length) {
                            return resolve(polyCityRes[0].poly);
                          } else {
                            return resolve('');
                          }
                        })
                      } else {
                        return resolve(self.oldCityPoly[id]);
                      }
                    } else {
                      return resolve('');
                    }
                  }
                })
              })
            }

            myPromisesAr.push(self.oldHoodPoly[id]);
            promises.push(self.oldHoodPoly[id]);
          })

          Promise.all(myPromisesAr).then(function (polyHoodResults) {
            polyHoodResults = _.compact(polyHoodResults);
            if (polyHoodResults.length) {
              dataObj[row.id].polygons = polyHoodResults;
            } else {
              // bad data, remove the ss
              dataObj[row.id] = null;
              console.log("removed because of hood not found: " + row.id);

            }
          })
        } else if (flatFilters['COMMON_city']) {
          var id = flatFilters['COMMON_city'];
          if (!self.oldCityPoly[id]) {
            self.oldCityPoly[id] = new Promise(function (resolve, reject) {
              self.sequelize.query("select astext(polygon) as poly from city where id = " + id).then(function (polyCityRes) {
                if (polyCityRes && polyCityRes.length) {
                  return resolve(polyCityRes[0].poly);
                } else {
                  // bad data, it's probably hood, not city
                  console.log("trying to fix bad data for city id, ss: " + row.id);
                  if (!self.oldHoodPoly[id]) {
                    self.sequelize.query("select astext(polygon) as poly from hood where id = " + id).then(function (polyHoodRes) {
                      if (polyHoodRes && polyHoodRes.length) {
                        return resolve(polyHoodRes[0].poly);
                      } else {
                        return resolve('');
                      }
                    })
                  } else {
                    return resolve(self.oldHoodPoly[id]);
                  }
                }
              })
            })
          }

          promises.push(self.oldCityPoly[id]);

          self.oldCityPoly[id].then(function (polyCityResult) {
            if (polyCityResult) {
              dataObj[row.id].polygons = [polyCityResult];
            } else {
              // bad data, remove the ss
              dataObj[row.id] = null;
              console.log("removed because of city not found: " + row.id);
            }
          })
        } else if (row.bounds) {
          var bounds = JSON.parse(row.bounds);
          data.bounds = {
            northeast: {lat: bounds.x1, lng: bounds.y1},
            southwest: {lat: bounds.x2, lng: bounds.y2}
          }
        }
      })

      return Promise.all(promises).then(function () {
        _.keys(dataObj).forEach(function (key) {
          var data = dataObj[key];
          if (data) {
            //console.log(data);
            Migrate.savePromises.push(self.SavedSearch.create(data));
          }
        })
        return self.migrateChunk(++chunk);

      })

    });
  }

  var defaultMaxListenersBackup = require('events').EventEmitter.defaultMaxListeners;
  require('events').EventEmitter.defaultMaxListeners = 0;
  var migrate = new Migrate();
  migrate.run()
    .then(function () {
      console.log("Saving data...");
      Promise.all(Migrate.savePromises).then(function () {
        require('events').EventEmitter.defaultMaxListeners = defaultMaxListenersBackup;
        console.log("finished");
      })
    }).catch(function (err) {
      require('events').EventEmitter.defaultMaxListeners = defaultMaxListenersBackup;
      console.log("error :" + err);
    })
};

var mapRESALE_COMMON_property_type = {
  "condo-apt": ["condos", "lofts"],
  "condo-townhouse": ["condos", "townhouses"],
  "detached": ["detached-homes"],
  "semi-detached": ["semi-detached-homes"],
  "townhouse": ["townhouses"],
  "other": ["miscellaneous"]
};

var mapCOMMON_num_baths = {
  "1": "1-plus",
  "2": "2-plus",
  "3": "3-plus"
};

function mapOldTypeToNew(old) {
  if (!old) {
    return "";
  }
  var types = old.split(",");
  var newTypes = [];
  types.forEach(function (type) {
    if (mapRESALE_COMMON_property_type[type]) {
      newTypes = _.extend(newTypes, mapRESALE_COMMON_property_type[type]);
    }
  })

  return newTypes.join(",");
}

function boundsToPoly(bounds) {
  return "POLYGON((" + bounds.y1 + " " + bounds.x1 + "," + bounds.y2 + " " + bounds.x1 + "," + bounds.y2 + " " + bounds.x2 + ", " + bounds.y1 + " " + bounds.x2 + "," + bounds.y1 + " " + bounds.x1 + "))";
}

module.exports = script;