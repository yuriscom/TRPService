var http = require('http')
  , when = require('when')
  , Geometry = require(PATH + '/lib/geometry');

function City () {
}

City.prototype.version = '1.0.0';

City.prototype.getAll = function (province) {
  var where;
  if(province){
    where = {web_id: province};
  }else{
    where = null;
  }

  var attributes = ['id', 'name', 'web_id'];
  return models.MainCity.findAll({

    attributes: attributes,
    include: [
      {
        model: models.MainProvince,
        as: 'Province',
        attributes: ['id', 'name' ,'web_id'],
        where: where
      }
    ]
  }).then(function (result){
    _.each(result, function (city){
      city.addField('province', city.dataValues.Province.name);
      city.addField('province_web_id', city.dataValues.Province.web_id);
      city.deleteField('Province');
    });

    return result;
  });

};

City.prototype.getById = function (key, province, options) {
  try {
    options = JSON.parse(options);
  } catch (e) {
    options = {};
  }

  var where = {};
  if(__.isInt(key)){
    where = {id: key};
  }else{
    where = {web_id: key};
  }

  var attributes = ['id', 'name', 'web_id', 'region_id', 'province_id', 'description', 'extra',
    [sequelize.fn('envelope', sequelize.col('MainCity.polygon')), 'envelope']
  ];
  options.includePoly = true;
  if (options.includePoly) {
    attributes.push('polygon');
  }

  return models.MainCity.find({

    where: where,
    attributes: attributes,
    include: [
      {
        model: models.MainProvince,
        as: 'Province',
        where: province ? {name: province} : {},
        attributes: ['id', 'name' ,'web_id']
      },
      {
        model: models.MainRegion,
        as: 'Region',
        attributes: ['id', 'name' ,'web_id']
      }
    ]
  }).then(function (city) {
    if (city === null){
      return null;
    }
    city.addImages();
    return models.MainHood.findAll({
      where: {city_id: city.id},
      as: 'Hood',
      attributes: ['id', 'name', 'web_id']

    }).then(function(hoods){
      city.dataValues.Hoods = hoods;

      city.addField('coords', __.getCoordsFromEnvelope(city.dataValues.envelope));

      city.addField('city', city.dataValues.name);
      city.addField('province', city.dataValues.Province.dataValues.name);
      city.addField('region', city.dataValues.Region.dataValues.name);
      city.addField('city_web_id', city.dataValues.web_id);
      city.addField('province_web_id', city.dataValues.Province.dataValues.web_id);
      city.addField('region_web_id', city.dataValues.Region.dataValues.web_id);
      city.deleteField('City');
      city.deleteField('Province');
      city.deleteField('Region');
      city.deleteField('envelope');

      if(city.dataValues.Hoods.length > 0){
        _.each(city.dataValues.Hoods, function (hood) {
          hood.addUrl(true, city.Province.web_id, city.web_id);
        });
      }
      city.addUrl(true, city.Province.web_id);
      return city;
    });
  });
};

City.prototype.getByBounds = function (bounds, isExact) {
  var boundsAr = bounds.split(',');
  if (boundsAr.length==4) {
    // bounding box
    var lat1 = boundsAr[0]
      , lng1 = boundsAr[1]
      , lat2 = boundsAr[2]
      , lng2 = boundsAr[3];

    var poly = __.createPolygonFromBB(lat1, lng1, lat2, lng2);

  } else {
    // real poly
    var poly = __.createPolygonFromBounds(boundsAr);
  }

  var where = '';
  if (isExact) {
    where = Sequelize.or(
      sequelize.fn('contains', sequelize.col('polygon'), sequelize.fn('geomfromtext', poly)),
      sequelize.fn('contains', sequelize.fn('geomfromtext', poly), sequelize.col('polygon'))
    );
  } else {
    where = Sequelize.or(
      sequelize.fn('st_intersects', sequelize.col('polygon'), sequelize.fn('geomfromtext', poly)),
      sequelize.fn('st_contains', sequelize.fn('geomfromtext', poly), sequelize.col('polygon'))
    );
  }

  return models.MainCity.findAll({
    attributes: ['id', 'name', 'web_id', 'polygon'],
    where: where
  }).then(function (result) {
    return result.map(function (row) {
      row.bounds = row.polygon;
      return row;
    });
  });
};

City.prototype.getPropertiesCount = function (ids, filters) {
  var Search = require(PATH + '/lib/search/property');

  var search = new Search();
  var propertySqlObj = search.getCountSqlObj(filters, 'simple');

  propertySqlObj.group = 'id';

  return models.Property.findAll(propertySqlObj).then(function(propertyResult){
    var propertyIds = propertyResult.map(function (idObj) {
      return idObj.toJSON().id;
    });

    if (propertyIds.length) {
      var subWhere = {id : propertyIds};
    } else {
      var subWhere = {id : null};
    }

    var sqlObj = {
      attributes: ['id', [sequelize.fn('count', sequelize.col('Property.id')), 'count']],
      where: sequelize.and(
          {id: ids}
      ),
      include: [
        {
          model: models.Property,
          as: 'Property',
          attributes: ['id'],
          where: subWhere,
          include: propertySqlObj.include
        }
      ],
      includeIgnoreAttributes: false,
      group: 'id'
    };

    return models.MainCity.findAll(sqlObj).then(function (result) {
      return result.map(function (row) {
        return row.toJSON();
      });
    });

  });
};

City.prototype.getProjectsCount = function (ids, filters) {
  var Search = require(PATH + '/lib/search/project');
  var search = new Search();

  var projectSqlObj = search.getCountSqlObj(filters, 'simple', filters.is_exact);
  projectSqlObj.group = 'id';

  return models.Precon.findAll(projectSqlObj).then(function(projectResult){
    var preconIds = projectResult.map(function (idObj) {
      return idObj.toJSON().id;
    });

    if (preconIds.length) {
      var subWhere = {id : preconIds};
    } else {
      var subWhere = {id : null};
    }

    var sqlObj = {
      attributes: ['id', [sequelize.fn('count', sequelize.col('Precon.id')), 'count']],
      where: sequelize.and(
          {id: ids}
      ),
      include: [
        {
          model: models.Precon,
          as: 'Precon',
          attributes: ['id'],
          where: subWhere
        }
      ],
      includeIgnoreAttributes: false,
      group: 'id'
    };

    return models.MainCity.findAll(sqlObj).then(function (result) {
      return result.map(function (row) {
        return row.toJSON();
      });
    });
  });
};

City.prototype.getUnitsCount = function (ids, filters) {
  var Search = require(PATH + '/lib/search/unit');
  var search = new Search();

  var unitSqlObj = search.getSqlObj(filters, 'simple');
  var preconWhere = [];
  unitSqlObj.include.forEach(function (obj) {
    if (_.has(obj, 'name') && obj.name == 'Precon' && _.has(obj, 'where')) {
      preconWhere = obj.where;
    }
  });


  var sqlObj = {
    attributes: ['id', [sequelize.fn('count', sequelize.col('Precon.PreconUnit.id')), 'count']],
    where: sequelize.and(
      {id: ids}
    ),
    include: [
      {
        model: models.Precon,
        as: 'Precon',
        attributes: ['id'],
        where: preconWhere,
        include: [
          {
            model: models.PreconUnit,
            as: 'PreconUnit',
            attributes: [],
            where: unitSqlObj.where
          }
        ]
      }
    ],
    includeIgnoreAttributes: false,
    group: 'id'
  };

  return models.MainCity.findAll(sqlObj).then(function (result) {
    return result.map(function (row) {
      return row.toJSON();
    });
  });
};

City.prototype.getFeaturedCities = function () {

  var res = {};

  res.property = models.MainCity.findAll({
    attributes: ['id', 'name', 'web_id', 'region_id', 'feature_property'],
    where: ['feature_property is not null'],
    as: 'MainCity',
    include: [
      {
        model: models.MainProvince,
        as: 'Province',
        attributes: ['id', 'name', 'web_id']
      }
    ]
  }).then(function (results) {
    var resOnAr = [];
    var resBcAr = [];

    return when.map(results, function (result){
      return result.addImages().then(function (result) {
        result.addFeaturedUrl(true, result.dataValues.Province.dataValues.web_id, 'property');
        result.addField('province', result.dataValues.Province.dataValues.name);
        if(result.dataValues.Province.dataValues.web_id === 'on'){
          resOnAr[result.dataValues.feature_property] = result;
        }else{
          resBcAr[result.dataValues.feature_property] = result;
        }

        result.deleteField('Province');
      });
    }).then(function () {
      return {on: resOnAr, bc: resBcAr};
    });

  });


  res.project = models.MainCity.findAll({
    attributes: ['id', 'name', 'web_id', 'region_id', 'feature_project'],
    where: ['feature_project is not null'],
    as: 'MainCity',
    include: [
      {
        model: models.MainProvince,
        as: 'Province',
        attributes: ['id', 'name', 'web_id']
      }
    ]
  }).then(function (results) {
    var resOnAr = [];
    var resBcAr = [];

    return when.map(results, function (result){
      return result.addImages().then(function (result) {
        result.addFeaturedUrl(true, result.dataValues.Province.dataValues.web_id, 'project');
        result.addField('province', result.dataValues.Province.dataValues.name);
        if(result.dataValues.Province.dataValues.web_id === 'on'){
          resOnAr[result.dataValues.feature_project] = result;
        }else{
          resBcAr[result.dataValues.feature_project] = result;
        }

        result.deleteField('Province');

      });
    }).then(function () {
      return {on: resOnAr, bc: resBcAr};
    });

  });

  return when.all([res.property, res.project]).then(function(objects){
    return [{properties: objects[0]}, {projects: objects[1]}];
  })
};

exports = module.exports = City;