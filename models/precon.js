var environments = require(PATH + '/configuration/environments.json')
    , environment = environments[ process.env.NODE_ENV || 'production' ]
    , when = require('when')
    ;

module.exports = function (sequelize) {

  var Precon = sequelize.import(PATH + '/models/base/precon');
  _.extend(Precon.options.instanceMethods, {
    addImages: function (limit, isExact) {
      var self = this;
      if (typeof limit === 'undefined' || !isExact) {
        limit = null;
      }
      return models.Precon.getImages(this.id, 'project', limit, isExact).then(function (res) {
        _.each(res, function (resource) {
          resource.alt_tag = self.dataValues.name+' at '+self.dataValues.addr_street
                             +((self.dataValues.addr_postal_code) ? ' '+self.dataValues.addr_postal_code : '')
                             +' '+self.MainCity.name+' '+self.MainProvince.name+', Canada';
        });
        self.dataValues.images = res;
        return self;
      })
    },
    addLogo: function () {
      var self = this;
      return models.Precon.getImages(this.id, 'project_logo').then(function (res) {
        _.each(res, function (resource) {
          resource.alt_tag = 'Logo of '+self.dataValues.name+' at '+self.dataValues.addr_street
                             +((self.dataValues.addr_postal_code) ? ' '+self.dataValues.addr_postal_code : '')
                             +' '+self.MainCity.name+' '+self.MainProvince.name+', Canada';
        });
        self.dataValues.logo = res;
        return self;
      })
    },
    addUrl: function (toDeleteTrace) {
      toDeleteTrace = (typeof toDeleteTrace === "undefined") ? false : true;

      this.dataValues.url = models.Precon.getUrl(this.toJSON());
      if (toDeleteTrace) {
        if (this.PB !== undefined) {
          this.deleteField('PB');
        }

        this.deleteField('MainCity');
        this.deleteField('MainHood');

      }
      return this;
    },
    addField: function (field, value) {
      this.dataValues[field] = value;
    },
    deleteField: function (field) {
      delete(this.dataValues[field]);
    }
  });

  _.extend(Precon.options.classMethods, {
    getImages: function (id, type, limit, isExact) {
      if (typeof limit === 'undefined' || !isExact) {
        limit = null;
      }
      var ResourceTemp = require(PATH + '/lib/resources/manager-temp');
      var resource = new ResourceTemp();
      return resource.getResources(id, type, limit).then(function (res) {
        return res;
      });
    },
    getUrl: function (precon) {

      if (! (precon.hasOwnProperty('name') && ( (precon.hasOwnProperty('PB') && precon.PB[0].Builder != null )|| precon.hasOwnProperty('builder_name'))
              && (precon.hasOwnProperty('MainCity') || precon.hasOwnProperty('city_web_id'))
              && precon.hasOwnProperty('is_vip_active')
          )) {
        return '';
      }

      var city_web_id, hood_web_id;
      var builderName;

      if(typeof precon.hood_web_id !== 'undefined' && typeof precon.city_web_id !== 'undefined'){
        city_web_id = precon.city_web_id;
        hood_web_id = precon.hood_web_id;
      }else{
        city_web_id = precon.MainCity.web_id;
        if(precon.MainHood === null) {
          hood_web_id = null
        }else{
          hood_web_id = precon.MainHood.web_id;
        }

      }

      if (typeof precon.builder_name !== 'undefined') {
        builderName = precon.builder_name;
      }else{
        if (typeof precon.PB[0] !== 'undefined') {
          builderName = precon.PB[0].Builder.web_id;
        }
      }

      return '/new-preconstruction/'
          + builderName
          + '/' + __.convertToWebId(precon.name)
          + '-in'
          + (hood_web_id ? '-' + hood_web_id : '')
          +'-' + city_web_id
          + (precon.is_vip_active == 1 ? '/vip-presale-registration' : '')
          + '/';
    }
  });

  Precon.reinit();

  return Precon;

};