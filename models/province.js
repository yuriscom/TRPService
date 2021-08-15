var environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , when = require('when')
  ;

module.exports = function (sequelize) {

  var Province = sequelize.import(PATH + '/models/base/province');
  _.extend(Province.options.instanceMethods, {

    addField: function (field, value) {
      this.dataValues[field] = value;
    },
    deleteField: function (field) {
      delete(this.dataValues[field]);
    },
    addUrl: function (toDeleteTrace) {

      toDeleteTrace = (typeof toDeleteTrace === "undefined") ? false : true;

      this.dataValues.url = models.Province.getUrl(this.toJSON());

      if (toDeleteTrace) {
        /*
        if (this.web_id !== undefined) {
          this.deleteField('web_id');
        }
        */
      }

      return this;
    }
  });

  _.extend(Province.options.classMethods, {
    getUrl: function (province) {

      if (!province.hasOwnProperty("web_id")) {
        return '';
      }

      return '/'+province.web_id+'-real-estate/';
    }
  });

  Province.reinit();

  return Province;

};