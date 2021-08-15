var http = require('http');
var when = require('when');

function Builder () {
}

Builder.prototype.version = '1.0.1';

Builder.prototype.getAutocomplete = function (params) {

  var Search = require(PATH + '/lib/search/builder');
  var search = new Search();
  var sqlObj = search.getSqlObj(params);

  return models.Builder.findAll(sqlObj).catch(function (error) {
    return error;
  });

};

Builder.prototype.getById = function (id) {
  return models.Builder.find({
      where: { id: id }
    }
  );
};

Builder.prototype.getByWebId = function (webid) {
  return models.Builder.find({
      where: { web_id: webid }
    }
  );
};

Builder.prototype.getSimple = function (params) {
  var Search = require(PATH + '/lib/search/builder');
  var search = new Search();
  var sqlObj = search.getSqlObj(params, 'simple', params.nested);

  return models.Builder.findAll(sqlObj).then(function (results) {
    return results;
  }).catch(function (error) {
    return error;
  });
};

exports = module.exports = Builder;