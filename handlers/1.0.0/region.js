var http = require('http')
  , when = require('when')
  , Geometry = require(PATH + '/lib/geometry');

function Region () {
}

Region.prototype.version = '1.0.0';

Region.prototype.getAll = function () {
  //TODO: Implement

};

Region.prototype.getById = function (key, parent, options) {
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

  var attributes = ['id', 'name', 'web_id', 'province_id', 'description', 'extra',
    [sequelize.fn('envelope', sequelize.col('MainRegion.polygon')), 'envelope']
  ];
  if (options.includePoly) {
    attributes.push('polygon');
  }

  return models.MainRegion.find({
    where: where,
    attributes: attributes,
    include: [
      {
        model: models.MainProvince,
        as: 'Province',
        attributes: ['id', 'name' ,'web_id']
      }
    ]
  }).then(function (region) {
    region.addImages();
    return models.MainCity.findAll({
      where: {region_id: region.id},
      as: 'City',
      attributes: ['id', 'name', 'web_id']

    }).then(function(cities){

      region.dataValues.Cities = cities;
      //todo: construct polygon & get coords

      region.addField('coords', __.getCoordsFromEnvelope(region.dataValues.envelope));

      if(region.dataValues.Cities.length > 0){
        _.each(region.dataValues.Cities, function (city) {
          city.addUrl(true, region.Province.web_id);
        });
      }

      region.addField('province', region.dataValues.Province.dataValues.name);
      region.addField('province_web_id', region.dataValues.Province.dataValues.web_id);
      region.addField('region', region.dataValues.name);
      region.addField('region_web_id', region.dataValues.web_id);
      region.deleteField('Province');
      region.deleteField('envelope');

      region.addUrl(true, region.Province.web_id);
      return region;
    });
  });
};


Region.prototype.getByBounds = function (bounds) {
  var boundsAr = bounds.split(',');
  var lat1 = boundsAr[0]
    , lng1 = boundsAr[1]
    , lat2 = boundsAr[2]
    , lng2 = boundsAr[3];

  var bbPolygon = __.createPolygonFromBB(lat1, lng1, lat2, lng2);
  return models.MainRegion.findAll({
    attributes: ['id', 'name', 'web_id', 'polygon'],
    where: Sequelize.or(
      sequelize.fn('st_intersects', sequelize.col('polygon'), sequelize.fn('geomfromtext', bbPolygon)),
      sequelize.fn('st_contains', sequelize.fn('geomfromtext', bbPolygon), sequelize.col('polygon'))
    )
  }).then(function (result) {
    return result.map(function (row) {
      row.bounds = row.polygon;
      return row;
    });
  });
};

Region.prototype.getPropertiesCount = function (ids, filters) {
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

    return models.MainRegion.findAll(sqlObj).then(function (result) {
      return result.map(function (row) {
        return row.toJSON();
      });
    });

  });
};

Region.prototype.getProjectsCount = function (ids, filters) {
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
          attributes: ['id'],
          where: subWhere
        }
      ],
      includeIgnoreAttributes: false,
      group: 'id'
    };

    return models.MainRegion.findAll(sqlObj).then(function (result) {
      return result.map(function (row) {
        return row.toJSON();
      });
    });
  });
};

Region.prototype.getUnitsCount = function (ids, filters) {
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

  return models.MainRegion.findAll(sqlObj).then(function (result) {
    return result.map(function (row) {
      return row.toJSON();
    });
  });
};



exports = module.exports = Region;