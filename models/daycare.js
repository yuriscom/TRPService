var environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , when = require('when')
  ;

module.exports = function (sequelize) {

  var Daycare = sequelize.import(PATH + '/models/base/daycare');
  _.extend(Daycare.options.instanceMethods, {
    addField: function (field, value) {
      this.dataValues[field] = value;
    }
  });

  Daycare.reinit();

  return Daycare;

};