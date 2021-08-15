/**
 * Created by jose on 2014-11-20.
 */
var when = require('when');
var environments = require(PATH + '/configuration/environments.json');
var environment = environments[ process.env.NODE_ENV || 'production' ];

function Manager () {
  this.versions = {};
  this.versions.preview_large = {ratio: '83:55', width: 415, height: 275, color: 'ffffff'};
  this.versions.preview_small = {ratio: '16:9', width: 320, height: 180, color: 'ffffff'};
}

exports = module.exports = Manager;

Manager.prototype.getResources = function (id, type, version, isLogo, limit) {
  var self = this;
  var where = {
    entity_id: id,
    entity_type: type
  };
  if(typeof limit === 'undefined'){
    limit = null;
  }
  if (isLogo === true) {
    where.path = { like: '%logo%'};
  } else {
    where.path = { notlike: '%logo%' };
  }

  return models.Resource.findAll({
    where: where,
    limit: limit
  }).then(function (results) {
    var resultsAr = [];
    _.each(results, function (result) {

      if(result.storage_engine === 'TRP'){
        var host = environment.resources.host;
      }
      if (version !== 'default') {
        resultsAr.push(host + '/image?height=' + self.versions[version].height
            + '&color=' + self.versions[version].color
            + '&width=' + self.versions[version].width
            + '&cropratio=' + self.versions[version].ratio
            + '&image=' + result.path);
      } else {
        resultsAr.push(host + result.path);
      }

    });
    return resultsAr;
  });
};

Manager.prototype.createResources = function (resource) {
  var self = this;
  
  return models.Resource.find({
    where: {
      path: resource.path
    }
  }).then(function (result){

    if(result === null){
      return models.Resource.build(resource).save().catch(function (err){
        return err;
      });
    }else{
      return result.destroy().then(function(){
        return self.createResources(resource);
      });

    }
  });


};