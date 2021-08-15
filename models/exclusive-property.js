var environments = require(PATH + '/configuration/environments.json')
    , environment = environments[ process.env.NODE_ENV || 'production' ]
    , when = require('when')
    ;

module.exports = function (sequelize) {

  var ExclusiveProperty = sequelize.import(PATH + '/models/base/exclusive-property');
  _.extend(ExclusiveProperty.options.instanceMethods, {
    addImages: function (limit) {
      var self = this;
      if(typeof limit === 'undefined'){
        limit = null;
      }
      return models.ExclusiveProperty.getImages(this.id, limit).then(function (res) {
        _.each(res, function (resource) {
          resource.alt_tag = self.dataValues.ExclusivePropertyTrpType.name+' at '+self.dataValues.addr_full+
                             ' '+self.dataValues.addr_postal_code+' '+self.MainCity.name+' '+self.MainProvince.name+', Canada';
        });
        self.dataValues.images = res;
        return self;
      });
    },
    addStockImages: function () {
      var self = this;
      var img;
      var imgArr = [
        '/assets/graphics/condo-4.jpg',
        '/assets/graphics/house-1.jpg'
      ];

      var simpleType = models.ExclusiveProperty.getSimpleType(self.ExclusivePropertyTrpType.name);

      if(simpleType === 'building'){
        img = imgArr[0];
      }

      if(simpleType === 'house'){
        img = imgArr[1];
      }

      self.dataValues.images = [img];

      return self;
    },
    privatizeField: function (field) {
      this.dataValues[field] = '-';
    },
    addUrl: function (toDeleteTrace) {

      toDeleteTrace = (typeof toDeleteTrace === "undefined") ? false : true;

      this.dataValues.url = models.ExclusiveProperty.getUrl(this.toJSON());

      if (toDeleteTrace) {
        this.deleteField('MainCity');
        this.deleteField('MainHood');
      }

      return this;
    },
    getGooglePlaces: function () {
      return rp('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + this.lat + ',' + this.lng + '&types=park|subway_station|train_station|grocery_or_supermarket|bus_station|convenience_store|shopping_mall&rankby=distance&key=AIzaSyALkHoD1bc9dJnvbri3PaU3uraf2gJQ684')
          .then(function (res) {
            return JSON.parse(res);
            //console.log(res);
          })
          .catch(console.error);
    },
    addGooglePlaces: function () {
      var self = this;
      return this.getGooglePlaces().then(function (res) {
        self.dataValues.googlePlaces = res;
        return self;
      })
    },
    addField: function (field, value) {
      this.dataValues[field] = value;
    },
    deleteField: function (field) {
      delete(this.dataValues[field]);
    },
    mergeImages: function () {
      this.dataValues.images = this.dataValues.images.concat(this.Precon.dataValues.images);
      delete(this.Precon.dataValues.images);
    }

  });

  _.extend(ExclusiveProperty.options.classMethods, {
    getExcludedPropertyTypes: function () {
      return [1, 4, 7, 10, 17, 22, 27, 30, 31];
    },
    getExcludedPropertyStyles: function () {
      return [10];
    },
    getImages: function (id, limit) {
      if(typeof limit === 'undefined'){
        limit = null;
      }
      var ResourceTemp = require(PATH + '/lib/resources/manager-temp');
      var resource = new ResourceTemp();
      return resource.getResources(id, 'exclusive_property', limit).then(function (res) {

        return res;
      });
    },
    getUrl: function (property) {

      if (! (property.hasOwnProperty("addr_full_slug") && property.hasOwnProperty("ExclusivePropertySaleType")
              && (property.hasOwnProperty('MainCity') || property.hasOwnProperty('city_web_id')) && property.hasOwnProperty('addr_postal_code')
          )) {
        return '';
      }

      var city_web_id, hood_web_id;

      if(typeof property.hood_web_id !== 'undefined' && typeof property.city_web_id !== 'undefined'){
        city_web_id = property.city_web_id;
        hood_web_id = property.hood_web_id;
      }else{
        city_web_id = property.MainCity.web_id;
        if(property.MainHood === null) {
          hood_web_id = null
        }else{
          hood_web_id = property.MainHood.web_id;
        }

      }

      return '/'+ property.ExclusivePropertySaleType.web_id +'/'
          + (property.Precon ? property.Precon.web_id + '-' : '')
          + property.addr_full_slug
          + (hood_web_id ? '-' + hood_web_id : '')
          + '-' + city_web_id
          + '-' + property.id
          + '/';
    },
    getSimpleType: function (type) {
      var buildings = [
        'Condo',
        'Multiplex',
        'Loft'
      ];

      var houses = [
        'Detached Home',
        'Semi-detached Home',
        'Townhouse',
        'Bungalow',
        'Cottage',
        'Misc. Listing'
      ];

      if (buildings.indexOf(type) > -1) {
        return 'building';
      } else {
        return 'house';
      }
    }
  });

  ExclusiveProperty.reinit();

  return ExclusiveProperty;

};