var environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , when = require('when')
  ;

module.exports = function (sequelize) {

  var MainProvince = sequelize.import(PATH + '/models/base/main-province');
  _.extend(MainProvince.options.instanceMethods, {

    addField: function (field, value) {
      this.dataValues[field] = value;
    },
    deleteField: function (field) {
      delete(this.dataValues[field]);
    },
    addUrl: function (toDeleteTrace) {

      toDeleteTrace = (typeof toDeleteTrace === "undefined") ? false : toDeleteTrace;

      this.dataValues.url = models.MainProvince.getUrl(this.toJSON());

      if (toDeleteTrace) {
        /*
        if (this.web_id !== undefined) {
          this.deleteField('web_id');
        }
        */
      }

      return this;
    },
    addFeaturedUrl: function (toDeleteTrace, type) {

      toDeleteTrace = (typeof toDeleteTrace === "undefined") ? false : toDeleteTrace;
      var trail;
      if(type === 'project'){
        trail = 'new-preconstruction-for-sale/'
      }
      if(type === 'property'){
        trail = 'mls-listings-for-sale/'
      }
      this.dataValues.url = models.MainProvince.getUrl(this.toJSON())+trail;

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
      return models.MainProvince.getImages(this.id, 'province', limit).then(function (res) {
        _.each(res, function (resource) {
          resource.alt_tag = self.dataValues.name+', Canada';
        });
        self.dataValues.images = res;
        return self;
      })
    }
  });

  _.extend(MainProvince.options.classMethods, {
    getUrl: function (province) {

      if (!province.hasOwnProperty("web_id")) {
        return '';
      }

      return '/'+province.web_id+'-real-estate/';
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

  MainProvince.reinit();

  return MainProvince;

};