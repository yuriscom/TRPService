var environments = require(PATH + '/configuration/environments.json')
  , environment  = environments[process.env.NODE_ENV || 'production']
  , when         = require('when')
  ;

module.exports = function (sequelize) {

  var Property = sequelize.import(PATH + '/models/base/property');
  _.extend(Property.options.instanceMethods, {
    addImages: function (limit, isExact) {
      var self = this;
      if (typeof limit === 'undefined' || !isExact) {
        limit = null;
      }
      return models.Property.getImages(this.id, limit, isExact).then(function (res) {
        _.each(res, function (resource) {
          resource.alt_tag = self.dataValues.PropertyTrpType.name+' at '+self.dataValues.addr_full+
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

      var simpleType = models.Property.getSimpleType(self.PropertyTrpType.name);

      if (simpleType === 'building') {
        img = {path: imgArr[0]};
      }

      if (simpleType === 'house') {
        img = {path: imgArr[1]};
      }

      self.dataValues.images = [img];

      return self;
    },
    privatizeField: function (field) {
      var privateValue;
      switch (field) {
        case 'price':
          this.dataValues['private_'+field] = this.dataValues[field];
          privateValue = models.Property.getPrivatePrice(this.dataValues[field]);
          break;
        case 'sqft':
          privateValue  = models.Property.getPrivateSqft(this.dataValues[field]);
          break;
        case 'num_beds':
        case 'num_baths':
          privateValue = models.Property.getPrivateRoom(this.dataValues[field]);
          break;
        default:
          privateValue = '-';
          break;
      }

      this.dataValues[field] = privateValue;

    },
    addUrl: function (toDeleteTrace) {

      toDeleteTrace = (typeof toDeleteTrace === "undefined") ? false : true;

      this.dataValues.url = models.Property.getUrl(this.toJSON());

      if (toDeleteTrace) {
        this.deleteField('MainCity');
        this.deleteField('MainHood');
      }

      return this;
    },
    getGooglePlaces: function () {
      return rp('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + this.lat + ',' + this.lng + '&types=park|subway_station|train_station|grocery_or_supermarket|bus_station|convenience_store|shopping_mall&rankby=distance&key=APIKEY')
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
    }

  });

  _.extend(Property.options.classMethods, {
    getExcludedPropertyTypes: function () {
      return [1, 4, 7, 10, 17, 22, 27, 30, 31];
    },
    getExcludedPropertyStyles: function () {
      return [10];
    },
    getImages: function (id, limit, isExact) {
      if (typeof limit === 'undefined' || !isExact) {
        limit = null;
      }
      var ResourceTemp = require(PATH + '/lib/resources/manager-temp');
      var resource = new ResourceTemp();
      return resource.getResources(id, 'property', limit).then(function (res) {

        _.each(res, function (resource) {
          //resource.alt_tag = this.propertyTrpType.id;
        });
        return res;
      });
    },
    getUrl: function (property) {

      if (!(property.hasOwnProperty("addr_full_slug")
            && (property.hasOwnProperty('MainCity') || property.hasOwnProperty('city_web_id')) && property.hasOwnProperty('addr_postal_code')
            && property.hasOwnProperty('mls_num')
        )) {
        return '';
      }

      //      if(typeof property.EntityAreaCity[0] === 'undefined'){
      //        return '';
      //      }

      var city_web_id, hood_web_id;

      if (typeof property.hood_web_id !== 'undefined' && typeof property.city_web_id !== 'undefined') {
        city_web_id = property.city_web_id;
        hood_web_id = property.hood_web_id;
      } else {
        city_web_id = property.MainCity.web_id;
        if (property.MainHood === null) {
          hood_web_id = null
        } else {
          hood_web_id = property.MainHood.web_id;
        }

      }

      var addr_postal_code = property.addr_postal_code;
      addr_postal_code = property.addr_postal_code.replace(/\s+/g, '');
      addr_postal_code = addr_postal_code.toLowerCase();
      var mls_num = property.mls_num;
      mls_num = mls_num.toLowerCase();

      return '/mls-listings/'
             + property.addr_full_slug
             + (hood_web_id ? '-' + hood_web_id : '')
             + '-' + city_web_id
             + '-' + addr_postal_code
             + '-mls-' + mls_num
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
      ]

      if (buildings.indexOf(type) > -1) {
        return 'building';
      } else {
        return 'house';
      }
    },
    getPrivatePrice: function (price) {
      var privatePrice;
      var suffix = 'K';
      price = parseFloat(price);

      if (price === undefined || price === null || price == 0) {
        return;
      }

      if (price >= 950000) {
        suffix = 'M';
        if (price % 100000 == 0) {
          var approxPrivatePrice = Math.ceil(price / 100000) / 10 + 0.1;
          privatePrice = approxPrivatePrice.toFixed(1);
        } else {
          privatePrice = Math.ceil(price / 100000) / 10;
        }
      } else {
        if (price % 50000 == 0) {
          privatePrice = Math.ceil(price / 50000) * 50 + 50;
        } else {
          privatePrice = Math.ceil(price / 50000) * 50;
        }
      }

      return 'Under ' + privatePrice + suffix;
    },
    getPrivateSqft: function (sqft) {
      if(sqft.match(/\+/)){
        return sqft;
      }

      var privateSqft;
      var splittedSqftAr = sqft.split('-');
      if (_.isUndefined(splittedSqftAr[1])) {
        privateSqft = '-';
      }else{
        privateSqft = 'Under ' + splittedSqftAr[1];
      }

      return privateSqft;
    },
    getPrivateRoom: function (roomsNum) {
      if(roomsNum == 0 || roomsNum == 1){
        return '-';
      }

      return 'Over ' + (parseInt(roomsNum) - 1);

    }
  });

  Property.reinit();

  return Property;

};
