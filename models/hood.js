var environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , when = require('when')
  ;

module.exports = function (sequelize) {

  var Hood = sequelize.import(PATH + '/models/base/hood');
  _.extend(Hood.options.instanceMethods, {

    addField: function (field, value) {
      this.dataValues[field] = value;
    },
    deleteField: function (field) {
      delete(this.dataValues[field]);
    },
    addUrl: function (toDeleteTrace, province, city) {

      toDeleteTrace = (typeof toDeleteTrace === "undefined") ? false : true;

      this.dataValues.url = models.Hood.getUrl(this.toJSON(), province, city);

      if (toDeleteTrace) {
        /*
        if (this.web_id !== undefined) {
          this.deleteField('web_id');
        }
        */
      }

      return this;
    },
    addFeaturedUrl: function (toDeleteTrace, province, city, type) {

      toDeleteTrace = (typeof toDeleteTrace === "undefined") ? false : true;
      var trail;
      if(type === 'project'){
        trail = 'new-preconstruction-for-sale/'
      }
      if(type === 'property'){
        trail = 'mls-listings-for-sale/'
      }
      this.dataValues.url = models.Hood.getUrl(this.toJSON(), province, city)+trail;

      if (toDeleteTrace) {
        if (this.web_id !== undefined) {
          this.deleteField('web_id');
        }
      }

      return this;
    }
  });

  _.extend(Hood.options.classMethods, {
    getUrl: function (hood, province, city) {

      if (!(hood.hasOwnProperty("web_id") && typeof province !== 'undefined' && typeof city !== 'undefined')) {
        return '';
      }

      return '/'+province+'-'
        + city +'/'
        + hood.web_id+'/'
    }
  });

  Hood.reinit();

  return Hood;

};