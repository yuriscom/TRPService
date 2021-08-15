var environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , when = require('when')
  ;

module.exports = function (sequelize) {

  var MainHood = sequelize.import(PATH + '/models/base/main-hood');
  _.extend(MainHood.options.instanceMethods, {

    addField: function (field, value) {
      this.dataValues[field] = value;
    },
    deleteField: function (field) {
      delete(this.dataValues[field]);
    },
    addUrl: function (toDeleteTrace, province, city) {

      toDeleteTrace = (typeof toDeleteTrace === "undefined") ? false : toDeleteTrace;

      this.dataValues.url = models.MainHood.getUrl(this.toJSON(), province, city);

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

      toDeleteTrace = (typeof toDeleteTrace === "undefined") ? false : toDeleteTrace;
      var trail;
      if(type === 'project'){
        trail = 'new-preconstruction-for-sale/'
      }
      if(type === 'property'){
        trail = 'mls-listings-for-sale/'
      }
      this.dataValues.url = models.MainHood.getUrl(this.toJSON(), province, city)+trail;

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
      return models.MainHood.getImages(this.id, 'hood', limit).then(function (res) {
        _.each(res, function (resource) {
          resource.alt_tag = self.dataValues.name+' '+self.City.name+', '+self.City.Province.name+', Canada';
        });
        self.dataValues.images = res;
        return self;
      })
    }
  });

  _.extend(MainHood.options.classMethods, {
    getUrl: function (hood, province, city) {

      if (!(hood.hasOwnProperty("web_id") && typeof province !== 'undefined' && typeof city !== 'undefined')) {
        return '';
      }

      return '/'+province+'-'
        + city +'/'
        + hood.web_id+'/'
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

  MainHood.reinit();

  return MainHood;

};