var environments = require(PATH + '/configuration/environments.json')
  , environment = environments[process.env.NODE_ENV || 'production']
  , when = require('when')
  ;

module.exports = function (sequelize) {

  //var SavedSearch = sequelize.import(PATH + '/models/base/saved-search');
  var SavedSearch = sequelize.import(PATH + '/models/base/saved-search-property');
  _.extend(SavedSearch.options.instanceMethods, {

    addField: function (field, value) {
      this.dataValues[field] = value;
    },
    deleteField: function (field) {
      delete(this.dataValues[field]);
    },
    addEventParams: function (params, type) {
      switch (type) {
        case 'prospect-match':
          // maketo_event_id added in the event handler.
          var event = {
            ext_table: 'SavedSearchProperty',
            ext_id: this.id,
            track_marketo_cookie: params.track_marketo_cookie,
            track_ip: params.track_ip,
            track_browser: params.track_browser,
            track_browser_version: params.track_browser_version,
            track_os: params.track_os,
            track_os_version: params.track_os_version,
            track_landing_page: params.track_landing_url,
            track_http_referrer: params.track_http_referrer,
            track_page_url: params.track_page_url,
            track_channel: params.track_channel
          };
          break;
        case 'prospect-match-alert':
          break;
        default:
          break;
      }

      this.dataValues.event_params = event;

      return this;
    },


    addFilters: function () {
      this.flatAreaNames();
      this.addField('filters', models.SavedSearch.getFilters(this.toJSON()));
      return this;
    },

    flatAreaNames: function() {
      var obj = this.toJSON();
      this.dataValues.city_name = "";
      this.dataValues.hood_name = "";
      if (__.isset(obj, "City", "name")) {
        this.dataValues.city_name = obj.City.name;
      }

      if (__.isset(obj, "Hood", "name")) {
        this.dataValues.hood_name = obj.Hood.name;
      }

      if (__.isset(obj, "Hoods")) {
        if (obj.Hoods.length > 1) {
          this.dataValues.hood_name = [];
          for (var i = 0; i<obj.Hoods.length; i++) {
            this.dataValues.hood_name.push(obj.Hoods[i].Hood.name);
          }
        }

        if (obj.Hoods.length == 1) {
          this.dataValues.hood_name = obj.Hoods[0].Hood.name;
        }
      }

      this.deleteField('City');
      this.deleteField('Hood');
      this.deleteField('Hoods');

      return this;
    }

  });


  _.extend(SavedSearch.options.classMethods, {
    filterKeys: {
      city_id: 'city',
      hood_ids: 'hood',
      property_type: 'type',
      min_price: 'min_price',
      max_price: 'max_price',
      beds: 'beds',
      baths: 'baths'
    },
    getFilters: function(obj) {
      var filters = {};
      _.keys(models.SavedSearch.filterKeys).forEach(function(key){
        if (key == 'city_id') {
          key = 'city_name';
        }

        if (key == 'hood_ids') {
          key = 'hood_name';
        }
        if (_.has(obj, key)){
          filters[key]= obj[key];
        }
      })
      return filters;
    }
    /*
    ,
    getFilters: function (filters) {
      return when.promise(function (resolve, reject, notify) {
        var cityObj;
        var hoodsAr;
        var parsedFilters = {};
        _.each(filters, function (filter) {
          if (filter.hasOwnProperty('RESALE_COMMON_property_type')
            && (filter.RESALE_COMMON_property_type !== null && filter.RESALE_COMMON_property_type !== '')) {
            parsedFilters.property_type = filter.RESALE_COMMON_property_type;
          }
          if (filter.hasOwnProperty('COMMON_price_min')) {
            if (filter.COMMON_price_min == null || filter.COMMON_price_min == '') {
              parsedFilters.price_min = 0;
            } else {
              parsedFilters.price_min = filter.COMMON_price_min;
            }
          }
          if (filter.hasOwnProperty('COMMON_price_max')) {
            if (filter.COMMON_price_max == null || filter.COMMON_price_max == '') {
              parsedFilters.price_max = null;
            } else {
              parsedFilters.price_max = filter.COMMON_price_max;
            }
          }
          if (filter.hasOwnProperty('COMMON_num_beds')
            && (filter.COMMON_num_beds !== null && filter.COMMON_num_beds !== '')) {
            parsedFilters.num_beds = filter.COMMON_num_beds;
          }
          if (filter.hasOwnProperty('COMMON_num_baths')
            && (filter.COMMON_num_beds !== null && filter.COMMON_num_beds !== '')) {
            parsedFilters.num_baths = filter.COMMON_num_baths;
          }
          if (filter.hasOwnProperty('COMMON_city')) {
            cityObj = models.City.find({
              attributes: ['name'],
              where: {id: parseInt(filter.COMMON_city)}
            }).then(function (cityObj) {

              return cityObj;
            });
          }
          ;
          if (filter.hasOwnProperty('COMMON_hood')) {
            if (filter.COMMON_hood != '' && filter.COMMON_hood != null) {
              hoodsAr = models.Hood.findAll({
                attributes: ['name'],
                where: {id: filter.COMMON_hood.split(',')}
              }).then(function (hoodsAr) {
                var hoodNamesAr = [];
                _.each(hoodsAr, function (hood) {
                  hoodNamesAr.push(hood.name);
                });
                return hoodNamesAr;
              });
            }
          }
          ;
        });

        when.join(cityObj, hoodsAr).then(function (values) {
          if (typeof values[0] != 'undefined') {
            parsedFilters.city = values[0].dataValues.name;
          }
          if (typeof values[1] != 'undefined') {
            parsedFilters.hood = values[1];
          }
          resolve(parsedFilters);
        });
      });
    }
    */
  });


  SavedSearch.reinit();

  return SavedSearch;

};