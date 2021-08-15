var environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , when = require('when')
  ;

module.exports = function (sequelize) {

  var MainCity = sequelize.import(PATH + '/models/base/main-city');
  _.extend(MainCity.options.instanceMethods, {

    addField: function (field, value) {
      this.dataValues[field] = value;
    },
    deleteField: function (field) {
      delete(this.dataValues[field]);
    },
    addUrl: function (toDeleteTrace, province) {

      toDeleteTrace = (typeof toDeleteTrace === "undefined") ? false : toDeleteTrace;

      this.dataValues.url = models.MainCity.getUrl(this.toJSON(), province);

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

      toDeleteTrace = (typeof toDeleteTrace === "undefined") ? false : toDeleteTrace;
      var trail;
      if(type === 'project'){
        trail = 'new-preconstruction-for-sale/'
      }
      if(type === 'property'){
        trail = 'mls-listings-for-sale/'
      }
      this.dataValues.url = models.MainCity.getUrl(this.toJSON(), province)+trail;

      if (toDeleteTrace) {
        if (this.web_id !== undefined) {
          this.deleteField('web_id');
        }
      }

      return this;
    },
    addImages: function (limit) {
      var self = this;
      if(typeof limit === 'undefined'){
        limit = null;
      }
      return models.MainCity.getImages(this.id, 'city', limit).then(function (res) {
        _.each(res, function (resource) {
          resource.alt_tag = self.dataValues.name+' '+self.Province.name+', Canada';
        });
        self.dataValues.images = res;
        return self;
      })
    }
  });

  _.extend(MainCity.options.classMethods, {
    getUrl: function (city, province) {
      if (!(city.hasOwnProperty("web_id") && typeof province !== "undefined")) {
        return '';
      }

      return '/'+province+'-'+city.web_id+'/';
    },
    getImages: function (id, type, limit) {
      if(typeof limit === 'undefined'){
        limit = null;
      }
      var ResourceTemp = require(PATH + '/lib/resources/manager-temp');
      var resource = new ResourceTemp();
      return resource.getResources(id, type, limit).then(function (res) {
        return res;
      });
    }
  });

  MainCity.reinit();

  return MainCity;

};