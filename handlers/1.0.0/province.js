var http = require('http')
  , when = require('when')
  , Geometry = require(PATH + '/lib/geometry');

function Province () {
}

Province.prototype.version = '1.0.0';

Province.prototype.getAll = function () {
  //TODO: Implement

};




Province.prototype.getById = function (key, parent, options) {
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

  var attributes = ['id', 'name', 'web_id', [sequelize.fn('envelope', sequelize.col('polygon')), 'envelope']];
  if (options.includePoly) {
    attributes.push('polygon');
  }

  return models.MainProvince.find({
    where: where,
    attributes: attributes
  }).then (function (result) {

    if (result === null) {
      return null;
    }
    result.addImages();
    return models.MainRegion.findAll({
      where: {province_id: result.id},
      attributes: ['id', 'name', 'web_id']
    }).then(function (regions) {

      result.dataValues.Regions = regions;

      result.addField('coords', __.getCoordsFromEnvelope(result.dataValues.envelope));

      result.deleteField('envelope');

      return when.map(result.dataValues.Regions, function (region) {
        region.addUrl(true, result.web_id);
      }).then(function() {
        result.addUrl(true);
        return result;
      });


    });
  });
};

Province.prototype.getSimple = function (params) {
  var Search = require(PATH + '/lib/search/province');
  var search = new Search();
  var sqlObj = search.getSqlObj(params, 'simple', params.nested);

  return models.MainProvince.findAll(sqlObj).then(function (results) {
    return results;
  }).catch(function (error) {
    return error;
  });
};

/*
Province.prototype.getByWebId = function (webid) {
  return models.Province.find({
      where: { web_id: webid },
      attributes: ['id', 'name', 'web_id', 'bounds'],
      include: [
        {
          model: models.City,
          required: false,
          attributes: ['id', 'name', 'web_id', 'region_id', 'bounds']
        }
      ]
    }
  );
};
*/

exports = module.exports = Province;