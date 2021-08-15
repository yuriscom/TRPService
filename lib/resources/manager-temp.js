/**
 * Created by jose on 2014-11-20.
 */
var when = require('when');
var environments = require(PATH + '/configuration/environments.json');
var environment = environments[ process.env.NODE_ENV || 'production' ];

function ManagerTemp () {
  this.versions = {};
  this.versions.preview_large = {ratio: '83:55', width: 415, height: 275, color: 'ffffff'};
  this.versions.preview_small = {ratio: '16:9', width: 320, height: 180, color: 'ffffff'};
}

exports = module.exports = ManagerTemp;

ManagerTemp.prototype.getResources = function (id, type, limit) {
  return Promise.resolve([]);
  var self = this;
  var where = {
    entity_id: id,
    entity_type: type
  };
  if(typeof limit === 'undefined'){
    limit = null;
  }

  return models.ResourceTemp.findAll({
    where: where,
    limit: limit
  }).then(function (results) {
    var host;
    _.each(results, function (result) {

      if(result.storage_engine === 'TRP'){
        host = environment.resources.trp.host;
      }
      if(result.storage_engine === 'S3'){
        host = environment.resources.s3.host;
      }
      result.path = host + result.path;

    });

    return __.naturalSortObj(results, 'path');
  });
};

ManagerTemp.prototype.createResources = function (resource) {
  var self = this;

  return models.ResourceTemp.find({
    where: {
      path: resource.path
    }
  }).then(function (result){
    if(result === null){
      return models.ResourceTemp.build(resource).save().catch(function (err){
        return err;
      });
    }else{
      return result.destroy().then(function(){
        return self.createResources(resource);
      });

    }
  });


};