var http = require('http')
  , when = require('when')
  ;

function PropertyTrpType () {
}

PropertyTrpType.prototype.version = '1.0.0';

PropertyTrpType.prototype.getByName = function (val) {
  var self = this;

  return models.PropertyTrpType.find({
      where: {sys_name: val.name}
  }).then(function (type) {
    return type;
  });
};

PropertyTrpType.prototype.getAll = function () {
  return models.PropertyTrpType.findAll();
};

exports = module.exports = PropertyTrpType;