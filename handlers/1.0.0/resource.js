function Resource () {
}
var Manager = require(PATH + '/lib/resources/manager');

Resource.prototype.version = '1.0.0';

Resource.prototype.createResources = function (params) {
  console.log("here");
  var manager = new Manager();

  return manager.createResources(params);

};

Resource.prototype.deleteResource = function (id) {

  return models.Resource.findById(id).then(function (result){
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

exports = module.exports = Resource;
