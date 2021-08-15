var http = require('http')
  , when = require('when')
  ;

function Unit () {

}

Unit.prototype.version = '1.0.0';

Unit.prototype.getById = function (params) {
  return models.PreconUnit.findById(params.id).then(function (unit) {
    return unit;
  })
}

Unit.prototype.getMarkers = function (params) {
  var Search = require(PATH + '/lib/search/unit');
  var search = new Search();
  var sqlObj = search.getSqlObj(params, 'simple');
//console.log(sqlObj);

  var count = 0;
  return models.PreconUnit.findAndCountAll(sqlObj).then(function (results) {
    count = results.count;
    return when.map(results.rows, function (row) {
      row.addField('lat', row.Precon.lat);
      row.addField('lng', row.Precon.lng);
      row.addField('project_id', row.Precon.id);
      row.addField('project_name', row.Precon.name);
      row.deleteField('Precon');
      return row.toJSON();
    }).then(function (listings) {
      var result = {};
      result.totalCount = count;
      result.currentPage = (parseInt(params.page) || 1);
      result.num = (parseInt(params.num) || Search.defaultLimit);
      result.listings = listings;
      return result;
    }).then(function (result) {
      // clustering
      if (params.hasOwnProperty('zoom_level')) {
        var Cluster = require(PATH + '/lib/cluster');
        var cluster = new Cluster();
        var listings = _.clone(result.listings);

        var clustered = cluster.clusterize(listings, params.zoom_level);
        if (clustered.markers.length) {
          result.listings = clustered.markers;
        } else {
          delete result.listings;
        }

        if (clustered.clusters.length) {
          result.clusters = clustered.clusters;
        }
      }

      return result;
    });
  });

};

Unit.prototype.getSimple = function (params) {
  var Search = require(PATH + '/lib/search/unit');
  var search = new Search();
  var sqlObj = search.getSqlObj(params, 'simple');

  return models.PreconUnit.findAndCountAll(sqlObj).then(function (listings) {
    var result = {};
    result.totalCount = listings.count;
    result.currentPage = (parseInt(params.page) || 1);
    result.num = (parseInt(params.num) || Search.defaultLimit);
    result.listings = listings.rows;
    return result;
  });
};

Unit.prototype.getSummary = function (params) {
  var Search = require(PATH + '/lib/search/unit');
  var search = new Search();
  var sqlObj = search.getSqlObj(params, 'summary');

  var count = 0;
  return models.PreconUnit.findAndCountAll(sqlObj).then(function (results) {
    count = results.count;
    return when.map(results.rows, function (result) {
      return result.addImages().then(function (result) {
        return result.addUrl();
      });
    }).then(function (listings) {
      var result = {};
      result.totalCount = count;
      result.currentPage = (parseInt(params.page) || 1);
      result.num = listings.length;
      result.listings = listings;
      return result;
    });
  });
};

exports = module.exports = Unit;
