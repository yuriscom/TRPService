var Sequelize = require('../../lib/sequelize')
  , environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , options = _.extend({ path: PATH + '/models' }, environment.database)
  ;

exports = module.exports = function () {

  models.Hood.findAll({ where: ['bounds is not null'] }).then(function (hoods) {
    generatePolygon(hoods, 'hood');
  });

  models.City.findAll({ where: ['bounds is not null'] }).then(function (cities) {
    generatePolygon(cities, 'city');
  });

  models.Province.findAll({ where: ['bounds is not null'] }).then(function (provinces) {
    generatePolygon(provinces, 'province');
  });

  function generatePolygon (areaObj, table) {

    _.each(areaObj, function (area) {
      var polygonData = 'POLYGON((';
      var boundsObj = JSON.parse(area.bounds);
      var len = boundsObj.length;


      if ((boundsObj[0].lat !== boundsObj[len - 1].lat) && (boundsObj[0].lng !== boundsObj[len - 1].lng)) {
        boundsObj.push(boundsObj[0]);
        len++;
      }
      _.each(boundsObj, function (polygon) {
        polygonData += polygon.lng + ' ' + polygon.lat;
        polygonData += (len > 1) ? ', ' : '))';
        len = len - 1;
      });

      var sql = 'UPDATE ' + table + ' set polygon = GEOMFROMTEXT(\'' + polygonData + '\') where id = ' + area.id + ';';
      sequelize.query(sql);
    });
  }
};