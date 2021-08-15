function ResourceTemp () {
}
var Manager = require(PATH + '/lib/resources/manager-temp');

ResourceTemp.prototype.version = '1.0.0';

ResourceTemp.prototype.getResources = function (params) {
  var manager = new Manager();
  return manager.getResources(params.entity_id, params.entity_type, params.num);
};


ResourceTemp.prototype.createResources = function (params) {

  var manager = new Manager();

  return manager.createResources(params);

};

ResourceTemp.prototype.deleteResource = function (id) {

  return models.ResourceTemp.findById(id).then(function (result){
    if(result === null){
      return 'No resource found using id '+id;
    }

    return result.destroy().then(function (res){
      return res;
    }).catch(function (err){
      return err;
    });

  }).catch(function (err){
    return err;
  });

};

exports = module.exports = ResourceTemp;
