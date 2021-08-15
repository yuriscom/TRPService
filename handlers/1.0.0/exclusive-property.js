var http = require('http')
    , when = require('when')
    ;

function ExclusiveProperty () {
  this.responseLevelAr = ['full', 'summary', 'simple', 'autocomplete'];
  this.version = '1.0.0';
}

ExclusiveProperty.prototype.getCurrentVersion = function () {
  return _.last(__dirname.split('/'));
};

ExclusiveProperty.prototype.filterKeys = {
  COMMON_city: 'old_city',
  COMMON_hood: 'old_hood',
  RESALE_COMMON_property_type: 'property_type',
  COMMON_price_min: 'min_price',
  COMMON_price_max: 'max_price',
  COMMON_num_beds: 'beds',
  COMMON_num_baths: 'old_baths',
  RESALE_on: 'resale_on'
};

ExclusiveProperty.prototype.getById = function (params) {
  if (params.responseLevel === undefined || (this.responseLevelAr.indexOf(params.responseLevel) == -1)) {
    params.responseLevel = 'summary';
  }

  var where = [{province_id: {ne: null}}, {region_id: {ne: null}}, {city_id: {ne: null}}];
  if(__.isInt(params.key)){
    where.push({id: params.key});
  }else{
    throw 'Wrong format or missing parameter.';
  }
  var sqlObj = {
    where: where,
    doSubQuery:true
  };

  switch (params.responseLevel.toLowerCase()) {
    case 'full':
    case 'summary':

      sqlObj.include = [
        { model: models.ExclusivePropertyTrpType},
        { model: models.ExclusivePropertyStatus },
        { model: models.ExclusivePropertySaleType },
        { model: models.ExclusivePropertyRoom },
        { model: models.ExclusivePropertyStyle },
        { model: models.ExclusivePropertyParking },
        { model: models.ExclusivePropertyBuildingAmenity },
        { model: models.ExclusivePropertySpecDes},
        {
          model: models.Precon,
          attributes: ['id', 'name', 'web_id', 'description', 'is_vip_active', 'addr_street'],
          include: [

            { model: models.PreconBuilder, as: 'PB',
              include: {
                model: models.Builder,
                attributes: ['name', 'web_id']
              }
            },
            {
              model: models.MainProvince,
              required: false,
              attributes: ['id', 'name', 'web_id']
            },
            {
              model: models.MainCity,
              required: false,
              attributes: ['id', 'name', 'web_id']
            },
            {
              model: models.MainHood,
              required: false,
              attributes: ['id', 'name', 'web_id', 'city_id']
            }
          ]
        },
        {
          model: models.MainProvince,
          required: false,
          attributes: ['id', 'name', 'web_id']
        },
        {
          model: models.MainRegion,
          required: false,
          attributes: ['id', 'name', 'web_id']
        },
        {
          model: models.MainCity,
          required: false,
          attributes: ['id', 'name', 'web_id']
        },
        {
          model: models.MainHood,
          required: false,
          attributes: ['id', 'name', 'web_id', 'city_id']
        }
      ];
      break;
    case 'simple':
      break;
  }

  return models.ExclusiveProperty.find(sqlObj).then(function (prop) {

    if (!prop) {
      return {};
    }

    if (prop.is_public === false && params.isAuthenticated === false) {
      prop.dataValues.destinationUrl = prop.dataValues.url;
      prop.dataValues.redirectUrl = '/authenticate/';
    }

    if (params.responseLevel == 'simple' || prop.property_status_id == 3) {
      prop.addUrl();
      return prop.toJSON();
    }

    return prop.addImages().then(function (prop) {
      if(prop.Precon) {
        return prop.Precon.addImages().then(function (res) {
          prop.Precon.addUrl();
          prop.Precon.deleteField('MainCity');
          prop.Precon.deleteField('MainHood');
        });
      }
    }).then(function () {
      if (prop.Precon) {
        prop.mergeImages();
      }

      if(prop.MainProvince !== null) {
        prop.MainProvince.addFeaturedUrl(false, 'property');
      }else{
        return {};
      }
      if(prop.MainRegion !== null) {
        prop.MainRegion.addFeaturedUrl(false, prop.MainProvince.web_id, 'property');
      }else{
        return {};
      }
      if(prop.MainCity !== null) {
        prop.MainCity.addFeaturedUrl(false, prop.MainProvince.web_id, 'property');
      }else{
        return {};
      }
      if(prop.MainHood !== null) {
        prop.MainHood.addFeaturedUrl(false, prop.MainProvince.web_id, prop.MainCity.web_id, 'property');
      }
      prop.addUrl();
      return prop.toJSON();
    });
  });
};

ExclusiveProperty.prototype.getSummary = function (params) {

  var order = [];
  var limit = null;

  if(params.order_by === undefined){
    order.push(['id', 'ASC']);
  }else{
    order.push(params.order_by.split(','));
  }

  if(params.num !== undefined){
    limit = params.num;
  }

  return models.ExclusiveProperty.findAll({
    attributes: ['id', 'addr_full', 'addr_street_num', 'addr_street', 'addr_unit_num', 'price',
                 'num_beds', 'num_baths', 'sqft', 'is_public', 'addr_full_slug', 'addr_city_slug',
                 'addr_postal_code', 'mls_num', 'precon_id'],
    where: {
      exclusive_property_status_id: {ne:3}
    },
    include: [
      {
        model: models.Precon,
        required: false,
        attributes: ['id', 'name', 'web_id', 'description', 'is_vip_active']
      },
      { model: models.ExclusivePropertyTrpType},
      { model: models.ExclusivePropertyStatus },
      { model: models.ExclusivePropertySaleType },
      {
        model: models.MainProvince,
        required: false,
        attributes: ['id', 'name', 'web_id']
      },
      {
        model: models.MainCity,
        required: false,
        attributes: ['id', 'name', 'web_id']
      },
      {
        model: models.MainHood,
        required: false,
        attributes: ['id', 'name', 'web_id', 'city_id']
      }
    ],
    order: order,
    limit: limit

  }).then(function (results) {
    var assetsNum = (params.assets_num) ? parseInt(params.assets_num) : null;

    return when.map(results, function (result) {
      //adding images and url
      var promise = result.addImages(assetsNum);
      return when(promise).then(function (result) {
          return result.addUrl();
      }).then(function(result) {
        var propAddress = result.addr_street_num + ' ' + result.addr_street;
        var propUnitNum = (result.addr_unit_num !== null) ? ' - ' + 'Apt. ' + result.addr_unit_num : '';
        result.addField('address', propAddress + propUnitNum);
        // moving City/Hood to the root level, removing EntityArea level
        result.addField('Province', result.MainProvince.dataValues);
        result.addField('City', result.MainCity.dataValues);
        if(result.MainHood ===  null) {
          result.addField('Hood', '');
        }else{
          result.addField('Hood', result.MainHood.dataValues);

        }

        result.deleteField('MainHood');
        result.deleteField('MainCity');
        result.deleteField('MainProvince');
        result.deleteField('EntityAreaCity');
        result.deleteField('EntityAreaHood');
        return result;
      });
    }).then(function (listings) {
      var result = {};
      if (_.has(params, 'offset')) {
        result.offset = parseInt(params.offset);
      } else if (_.has(params, 'page')) {
        result.currentPage = (parseInt(params.page) || 1);
      }
      result.num = listings.length;
      result.listings = listings;
      return result;
    });
  });
};

ExclusiveProperty.prototype.runSavedSearch = function (ssId) {
  var Search = require(PATH + '/lib/search/exclusive-property');
  var search = new Search();
  //var responseLevel = 'reverse_saved_search';
  var self = this;
  var sqlObj;

  var SavedSearch = new handlers[this.version]['saved-search']();

  return SavedSearch.getById(ssId).then(function (savedSearch){

    if(!savedSearch){
      return;
    }
    var params = [];
    var queries = JSON.parse(savedSearch.queries);

    _.each(queries[0].filters, function (filter) {
      var key = Object.keys(filter);
      if(filter[key] !== null && filter[key] !== ''){
        params[self.filterKeys[key]] = filter[key];
      }
    });

    if(savedSearch.bounds !== null && savedSearch.bounds !== ''){
      var boundsObj = JSON.parse(savedSearch.bounds);
      params.bounds = boundsObj.x2+','+boundsObj.y2+','+boundsObj.x1+','+boundsObj.y1;
    }

    delete params.resale_on;

    sqlObj = search.getSqlObj(params);

    return models.ExclusiveProperty.findAll(sqlObj).then(function (results) {
      return results;
    }).catch(function (err) {
      throw err;
    });
  }).catch(function (err) {
    throw err;
  });

};


ExclusiveProperty.prototype.getScores = function (id) {
  var self = this;
  return models.ExclusiveProperty.find(
      {
        where: {id: id},
        attributes: ['id', 'lat', 'lng', 'addr_full', 'addr_city', 'walk_score', 'transit_score']

      }).then(function (prop) {

        var results = [];
        var walkScore;
        var transitScore;
        var isWalkScoreCached = false;
        var isTransitScoreCached = false;
        var Scores = new handlers[self.version].walkscore();

        if(prop.walk_score === null){
          walkScore = Scores.getWalkScore(prop.addr_full, prop.lat, prop.lng).then(function (res) {
            console.log(res.status);
            if(res.status !== 1){
              return 'Not Available';
            }else{
              return res.walkscore;
            }

          });
        }else{
          isWalkScoreCached = true;
          walkScore = prop.walk_score;
        }

        if(prop.transit_score === null){
          transitScore = Scores.getTransitScore(prop.addr_city, prop.lat, prop.lng).then(function (res) {
            if(res.error !== undefined){
              return 'Not Available';
            }else{
              return res.transit_score;
            }
          });
        }else{
          isTransitScoreCached = true;
          transitScore = prop.transit_score;
        }

        return when(walkScore).then(function(walk){
          return when(transitScore).then(function(transit){
            if(isWalkScoreCached === false || isTransitScoreCached === false){
              prop.walk_score = (__.isInt(walk)) ? walk : null;
              prop.transit_score = (__.isInt(transit)) ? transit : null;
              prop.save({fields: ['walk_score', 'transit_score']});
            }
            return {walkscore: walk, transit_score: transit};
          });
        });
      });
};

ExclusiveProperty.prototype.getSimilar = function (key, params) {
  if (params.offset === undefined) {
    params.offset = 0;
  }

  if (params.num === undefined) {
    params.num = 10;
  } else {
    params.num = Math.min(100, params.num);
  }

  var exclusivePropertyParams = { key: key, responseLevel: 'simple' };

  return this.getById(exclusivePropertyParams).then(function (prop) {

    if (!prop.hasOwnProperty('id')) {
      //todo: throw exception
      return {};
    }
    var bookmarksSql = '';

    if (params.isAuthenticated === true) {
      bookmarksSql = 'left join user_bookmark ub on property.id = ub.listing_id and ub.user_id = '
                     + params.authenticatedId + ' and is_deleted = 0 and listing_type = \'resale\' ';
    }
    var distance = '(3956 * 2 *'
        + 'ASIN('
        + 'SQRT('
        + 'POWER('
        + 'SIN('
        + '(' + prop.lat + '-abs(lat)) * pi()/180 / 2'
        + '),2'
        + ')'
        + '+ COS('
        + prop.lat + ' * pi()/180'
        + ')'
        + '* COS(pi()/180 * abs(lat))'
        + '* POWER('
        + 'SIN(pi()/180 / 2 * (' + prop.lng + ' - lng))'
        + ', 2'
        + ')'
        + ')'
        + ')'
        + ')';

    var sql = 'select id, price, lat, lng, num_beds, num_beds_plus, num_baths, city_web_id, hood_web_id, '
        + 'addr_full, addr_postal_code, addr_full_slug, addr_city, addr_hood, dom, real_dom, mls_num, '
        + 'is_public, PropertyTrpType, ' + ((params.isAuthenticated) ? 'favorite_id, ' : '')
        + '(distance*10 + price_dif/5000) as dissimilarity '
        + 'from('
        + 'select property.id, price, lat, lng, num_beds, num_beds_plus, num_baths, '
        + 'addr_full, addr_full_slug, addr_postal_code, addr_city, addr_hood, dom, real_dom, mls_num, '
        + 'is_public, property_trp_type.name as PropertyTrpType, '
        + 'eaCity.id as eaCityId, eaHood.id as eaHoodId, main_city.web_id as city_web_id, '
        + 'main_hood.web_id as hood_web_id, ' + ((params.isAuthenticated) ? 'ub.id as favorite_id, ' : '')
        + distance + ' as distance, abs(price - ' + prop.price + ') as price_dif '
        + 'from property '
        + bookmarksSql
        + 'join property_trp_type on property.property_trp_type_id=property_trp_type.id '
        + 'join map_entity_area as eaCity on eaCity.entity_id=property.id '
        + 'and eaCity.entity_type=\'resale\' and eaCity.area_type=\'city\' '
        + 'join main_city on eaCity.area_id=main_city.id and eaCity.entity_type=\'resale\' and eaCity.area_type=\'city\' '
        + 'join map_entity_area as eaHood on eaHood.entity_id=property.id '
        + 'and eaHood.entity_type=\'resale\' and eaHood.area_type=\'hood\' '
        + 'join main_hood on eaHood.area_id=main_hood.id and eaHood.entity_type=\'resale\' and eaHood.area_type=\'hood\' '
        + 'where lat is not null and lng is not null '
        + 'and listing_type_id=1 '
        + 'and property_trp_type_id=' + prop.exclusive_property_trp_type_id + ' '
        + 'and property_status_id=1 '
        + 'and is_out_of_area=0 '
        + 'and is_public=1 '
        + 'and property_style_id not in (' + models.Property.getExcludedPropertyStyles().join(', ') + ')'
        + 'and property.id != ' + prop.id + ' '
        + 'order by distance '
        + 'limit 1000 '
        + ') x '
        + 'order by dissimilarity asc '
        + 'limit ' + params.num + ' '
        + 'offset ' + params.offset + ' ';

    return sequelize.query(sql).then(function (results) {
      return when.map(results, function (result) {
        if (!params.isAuthenticated) {
          result.favorite_id = null;
        }
        return models.Property.getImages(result.id, params.assetsNum).then(
            function (images) {
              result.images = images;
              return result;
            }).then(function (result) {
              result.url = models.Property.getUrl(result);
              return result;
            });
      });
    });
  });
};

exports = module.exports = ExclusiveProperty;
