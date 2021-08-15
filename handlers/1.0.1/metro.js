var when = require('when');

function Metro () {
  this.metros = {
    gta: {
      name: 'Greater Toronto Area',
      pin: {
        x: -79.3901035795879,
        y: 43.7259082870783
      },
      cities: [1229,1222,1195,1194,1182,1163,1120,1108,1072,1053,997,986,980,915,905,895,838,836,787,769,754,704,697,695,693]
    },
    gva: {
      name: 'Greater Vancouver Area',
      pin: {
        x: -123.108938849758,
        y: 49.248513091046
      },
      cities: [39,81,91,223,280,283,349,363,380,404,452,482,526,542,622,647]
    }
  }
}

Metro.prototype.version = '1.0.1';

Metro.prototype.getSummary = function (params) {
  var self = this;

  var cityPolysQuery = 'SELECT id,name,polygon,pin ' +
  'FROM main_city ' +
  'WHERE id IN (' + self.metros[params.area].cities.join(',') + ');';

  var propertyCountQuery = 'SELECT mc.id AS city_id, count(p.id) AS propertyCount ' +
  'FROM main_city mc ' +
  'JOIN property p ON p.city_id = mc.id ' +
  'WHERE p.property_status_id = 1 AND p.lat IS NOT NULL AND p.lat != -1 AND p.lng IS NOT NULL AND p.lng != -1 AND p.listing_type_id = 1 AND p.is_out_of_area = 0 AND p.addr_postal_code regexp "^[a-zA-Z5][0-9oO][a-zA-Z5]" AND p.province_id IS NOT NULL AND mc.id IN (' + self.metros[params.area].cities.join(',') + ') ' +
  'GROUP BY mc.id ' +
  'ORDER BY mc.name;';

  var projectCountQuery = 'SELECT mc.id AS city_id, count(p.id) AS projectCount ' +
  'FROM main_city mc ' +
  'JOIN precon p ON p.city_id = mc.id ' +
  'WHERE p.hidden != 1 AND p.lat IS NOT NULL AND p.lat != -1 AND p.lng IS NOT NULL AND p.lng != -1 AND p.province_id IS NOT NULL AND mc.id IN (' + self.metros[params.area].cities.join(',') + ') ' +
  'GROUP BY mc.id ' +
  'ORDER BY mc.name;';

  var cityPolys = sequelize.query(cityPolysQuery).then(function (result) {
    return result;
  });

  var propertyCount = sequelize.query(propertyCountQuery).then(function (result) {
    return result;
  });
  var projectCount = sequelize.query(projectCountQuery).then(function (result) {
    return result;
  });

  return when.join(cityPolys, propertyCount, projectCount).then(function (results) {
    var cityPolys = results[0];
    var propCounts = results[1];
    var projCounts = results[2];

    var cityHash = {};
    cityPolys.forEach(function (cityObj) {
      var cityHashObj = cityObj;
      cityHashObj.propertyCount = 0;
      cityHashObj.projectCount = 0;
      cityHash[cityObj.id] = cityHashObj;
    });

    propCounts.forEach(function (propObj, index) {
      var runningCount = (cityHash[propObj.city_id].propertyCount || 0) + propObj.propertyCount;
      cityHash[propObj.city_id].propertyCount = runningCount;
    });

    projCounts.forEach(function (projObj, index) {
      var runningCount = (cityHash[projObj.city_id].projectCount || 0) + projObj.projectCount;
      cityHash[projObj.city_id].projectCount = runningCount;
    });

    var cities = _.values(cityHash);
    var result = {
      name: self.metros[params.area].name,
      pin: self.metros[params.area].pin,
      cities: cities
    };

    return result;
  });

}

exports = module.exports = Metro;
