var environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , when = require('when')
  ;

module.exports = function (sequelize) {

  var City = sequelize.import(PATH + '/models/base/city');
  _.extend(City.options.instanceMethods, {

    addField: function (field, value) {
      this.dataValues[field] = value;
    },
    deleteField: function (field) {
      delete(this.dataValues[field]);
    },
    addUrl: function (toDeleteTrace, province) {

      toDeleteTrace = (typeof toDeleteTrace === "undefined") ? false : true;

      this.dataValues.url = models.City.getUrl(this.toJSON(), province);

      if (toDeleteTrace) {
        /*
        if (this.web_id !== undefined) {
          this.deleteField('web_id');
        }
        */
      }

      return this;
    },
    addFeaturedUrl: function (toDeleteTrace, province, type) {

      toDeleteTrace = (typeof toDeleteTrace === "undefined") ? false : true;
      var trail;
      if(type === 'project'){
        trail = 'new-preconstruction-for-sale/'
      }
      if(type === 'property'){
        trail = 'mls-listings-for-sale/'
      }
      this.dataValues.url = models.City.getUrl(this.toJSON(), province)+trail;

      if (toDeleteTrace) {
        if (this.web_id !== undefined) {
          this.deleteField('web_id');
        }
      }

      return this;
    }
  });

  _.extend(City.options.classMethods, {
    getUrl: function (city, province) {
      if (!(city.hasOwnProperty("web_id") && typeof province !== "undefined")) {
        return '';
      }

      return '/'+province+'-'+city.web_id+'/';
    }
  });

  City.reinit();

  return City;

};