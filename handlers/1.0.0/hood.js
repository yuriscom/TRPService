var http = require('http')
  , when = require('when')
  , Geometry = require(PATH + '/lib/geometry');

function Hood () {
}

Hood.prototype.version = '1.0.0';

Hood.prototype.getAll = function () {
  //TODO: Implement
};

Hood.prototype.getById = function (key, city, options) {
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

  var attributes = ['id', 'name', 'web_id', 'city_id', 'description', 'extra',
    [sequelize.fn('envelope', sequelize.col('MainHood.polygon')), 'envelope']
  ];
  if (options.includePoly) {
    attributes.push('polygon');
  }

  return models.MainHood.find({
    where: where,
    attributes: attributes,
    include: [
      {
        model: models.MainCity,
        as: 'City',
        attributes: ['id', 'name', 'web_id'],
        where: city ? {web_id: city} : {},
        include: [
          {
            model: models.MainProvince,
            as: 'Province',
            attributes: [ 'id', 'name', 'web_id' ]
          },
          {
            model: models.MainRegion,
            as: 'Region',
            attributes: ['id', 'name' ,'web_id']
          }
        ]
      }
    ]
  }).then (function (result) {
    if (result === null) {
      return {};
    }

    return result.addImages().then(function () {
      result.addUrl(false, result.City.Province.web_id, result.City.web_id);
      result.addField('coords', __.getCoordsFromEnvelope(result.dataValues.envelope));
      result.addField('city', result.dataValues.City.dataValues.name);
      result.addField('province', result.dataValues.City.Province.dataValues.name);
      result.addField('region', result.dataValues.City.Region.dataValues.name);
      result.addField('hood_web_id', result.dataValues.web_id);
      result.addField('city_web_id', result.dataValues.City.dataValues.web_id);
      result.addField('province_web_id', result.dataValues.City.Province.dataValues.web_id);
      result.addField('region_web_id', result.dataValues.City.Region.dataValues.web_id);

      result.deleteField('web_id');
      result.deleteField('City');
      result.deleteField('Region');
      result.deleteField('Province');
      result.deleteField('envelope');

      return result;
    });
  });
};


Hood.prototype.getByBounds = function (bounds, isExact) {
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

  return models.MainHood.findAll({
    attributes: ['id', 'name', 'web_id', 'polygon'],
    where: where
  }).then(function (result) {
    return result.map(function (row) {
      row.bounds = row.polygon;
      return row;
    });
  });
};

Hood.prototype.getPropertiesCount = function (ids, filters) {
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
          model: models.Property, as: 'Property',
          attributes: ['id'],
          where: subWhere /*, required: false */ }
      ],
      includeIgnoreAttributes: false,
      group: 'id'
    };

    return models.MainHood.findAll(sqlObj).then(function (result) {
      return result.map(function (row) {
        return row.toJSON();
      });
    });

  });

};

Hood.prototype.getProjectsCount = function (ids, filters) {
  var Search = require(PATH + '/lib/search/project');
  var search = new Search();

  var projectSqlObj = search.getCountSqlObj(filters, 'simple');
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
          attributes: [],
          where: subWhere
        }
      ],
      includeIgnoreAttributes: false,
      group: 'id'
    };

    return models.MainHood.findAll(sqlObj).then(function (result) {
      return result.map(function (row) {
        return row.toJSON();
      });
    });
  });
};

Hood.prototype.getUnitsCount = function (ids, filters) {
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
            attributes: ['id'],
            where: unitSqlObj.where
          }
        ]
      }
    ],
    includeIgnoreAttributes: false,
    group: 'id'
  };

  return models.MainHood.findAll(sqlObj).then(function (result) {
    return result.map(function (row) {
      return row.toJSON();
    });
  });
};


Hood.prototype.getFeaturedHoods = function () {

  var res = {};

  res.property = models.MainHood.findAll({
    attributes: ['id', 'name', 'web_id', 'feature_property'],
    where: ['MainHood.feature_property is not null'],
    include: [
      {
        model: models.MainCity,
        as: 'City',
        attributes: ['id', 'name', 'web_id', 'region_id', 'province_id'],
        include: [
          {
            model: models.MainProvince,
            as: 'Province',
            attributes: ['id', 'name', 'web_id']
          }
        ]
      }
    ]
  }).then(function (results) {
    var resOnAr = [];
    var resBcAr = [];

    return when.map(results, function (result) {
      return result.addImages().then(function (result) {
        result.addFeaturedUrl(
          true, result.dataValues.City.Province.dataValues.web_id,
          result.dataValues.City.dataValues.web_id, 'property'
        );

        result.addField('city', result.dataValues.City.dataValues.name);
        result.addField('province', result.dataValues.City.Province.dataValues.name);

        if(result.dataValues.City.Province.dataValues.web_id === 'on'){
          resOnAr[result.dataValues.feature_property] = result;
        }else{
          resBcAr[result.dataValues.feature_property] = result;
        }

        result.deleteField('City');
        result.deleteField('Province');
      });

    }).then(function () {
      return {on: resOnAr, bc: resBcAr};
    });

  });


  res.project = models.MainHood.findAll({
    attributes: ['id', 'name', 'web_id', 'feature_project'],
    where: ['MainHood.feature_project is not null'],
    include: [
      {
        model: models.MainCity,
        as: 'City',
        attributes: ['id', 'name', 'web_id', 'region_id', 'province_id'],
        include: [
          {
            model: models.MainProvince,
            as: 'Province',
            attributes: ['id', 'name', 'web_id']
          }
        ]
      }
    ]
  }).then(function (results) {
    var resOnAr = [];
    var resBcAr = [];

    return when.map(results, function (result){
      return result.addImages().then(function (result) {
        result.addFeaturedUrl(
          true, result.dataValues.City.Province.dataValues.web_id,
          result.dataValues.City.dataValues.web_id, 'project'
        );

        result.addField('city', result.dataValues.City.dataValues.name);
        result.addField('province', result.dataValues.City.Province.dataValues.name);

        if(result.dataValues.City.Province.dataValues.web_id === 'on'){
          resOnAr[result.dataValues.feature_project] = result;
        }else{
          resBcAr[result.dataValues.feature_project] = result;
        }

        result.deleteField('City');
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

exports = module.exports = Hood;