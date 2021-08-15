var http = require('http')
  , when = require('when')
  ;

function Property() {
}

Property.prototype.version = '1.0.0';

Property.responseLevelAr = ['full', 'summary', 'simple', 'autocomplete'];

Property.prototype.getCurrentVersion = function () {
  return _.last(__dirname.split('/'));
};

Property.prototype.getById = function (params) {

  if ((params.responseLevel === undefined) || (Property.responseLevelAr.indexOf(params.responseLevel) == -1)) {
    params.responseLevel = 'summary';
  }

  var where = [{province_id: {ne: null}}, {region_id: {ne: null}}, {city_id: {ne: null}}];
  if (params.type == 'mls') {
    where.push({mls_num: params.key});
  } else if (__.isInt(params.key)) {
    where.push({id: params.key});
  } else {
    throw 'Wrong format or missing parameter.';
  }
  var sqlObj = {
    //attributes: ['id','addr_full'],
    where: where,
    doSubQuery: true
  };

  switch (params.responseLevel.toLowerCase()) {
    case 'full':
    case 'summary':

      sqlObj.include = [
        {
          model: models.PropertyTrpType,
          required: false
        },
        {model: models.PropertyRoom},
        {model: models.PropertyType},
        {model: models.PropertyStyle},
        {model: models.PropertyParking},
        {model: models.PropertyBuildingAmenity},
        {model: models.PropertySpecDes},
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
        },
      ];

      if (params.isAuthenticated === true) {
        sqlObj.include.push({
          model: models.UserBookmark,
          required: false,
          where: {user_id: params.authenticatedId, listing_type: 'resale', is_deleted: false}
        });
      }
      break;
    case 'simple':
      break;
  }

  return models.Property.find(sqlObj).then(function (prop) {

    if (!prop) {
      return {};
    }

    if (prop.is_public === false && params.isAuthenticated === false && prop.property_status_id !== 2) {
      prop.dataValues.destinationUrl = prop.dataValues.url;
      prop.dataValues.redirectUrl = '/authenticate/';
    }

    if (params.responseLevel == 'simple' || prop.property_status_id == 2) {
      prop.addUrl();
      return prop.toJSON();
    }

    if (prop.UserBookmarks && prop.UserBookmarks.length > 0) {
      prop.addField('favorite_id', prop.UserBookmarks[0].id);
    } else {
      prop.addField('favorite_id', null);
    }


    return prop.addImages().then(function (prop) {
      if (prop.MainProvince !== null) {
        prop.MainProvince.addFeaturedUrl(false, 'property');
      } else {
        return {};
      }
      if (prop.MainRegion !== null) {
        prop.MainRegion.addFeaturedUrl(false, prop.MainProvince.web_id, 'property');
      } else {
        return {};
      }
      if (prop.MainCity !== null) {
        prop.MainCity.addFeaturedUrl(false, prop.MainProvince.web_id, 'property');
      } else {
        return {};
      }
      if (prop.MainHood !== null) {
        prop.MainHood.addFeaturedUrl(false, prop.MainProvince.web_id, prop.MainCity.web_id, 'property');
      }

      prop.deleteField('UserBookmarks');
      prop.addUrl();
      return prop.toJSON();
    });
  });
};

Property.prototype.getMarkers = function (params) {
  var Search = require(PATH + '/lib/search/property');
  var search = new Search();
  var self = this;
  var sqlObj;

  if (params.saved_search_id !== undefined) {
    var SavedSearch = new handlers[this.version]['saved-search']();

    return SavedSearch.getById(params.saved_search_id).then(function (savedSearch) {

      if (!savedSearch) {
        return {
          totalCount: 0,
          currentPage: 1,
          num: 0,
          listings: []
        };
      }

      var ss = savedSearch.toJSON();

      _.each(_.keys(models.SavedSearch.filterKeys), function (filterKey) {
        if (_.has(ss, filterKey) && ss[filterKey] != null) {
          params[models.SavedSearch.filterKeys[filterKey]] = ss[filterKey] + '';
        }
      });

      if (savedSearch.polygon_text !== null) {
        params.polygon = savedSearch.polygon_text;
        try {
          params.polygon = JSON.parse(params.polygon);
        } catch(e) {
          // no worries, it's not an array
        }
      }

      /*
       { saved_search_id: '1',
       since: '2015-01-01 12:00:00',
       city: '1072',
       hood: '505',
       type: 'detached-homes,semi-detached-homes,townhouses,bungalows,',
       min_price: '150000',
       max_price: '1600000',
       beds: '2-plus',
       baths: '2-plus',
       bounds: '43.665552,-79.32490487999996,43.688940030000026,-79.30788191999994' }
       */

      /*
      params2 = {
        since: params.since,
        type: params.type,
        min_price: params.min_price,
        max_price: params.max_price,
        beds: params.beds,
        baths: params.baths,
        //polygon: 'POLYGON((-79.31621411999998 43.665552,-79.32354407999998 43.683379020000075,-79.32490487999996 43.68662298000004,-79.31413295999994 43.688940030000026,-79.31128391999994 43.682193,-79.30788191999994 43.673904,-79.31022983999998 43.67185299000004,-79.31301803999997 43.66633698000004,-79.31621411999998 43.665552))'
        polygon: [
          'POLYGON((-79.40217383999999 43.725104010000045,-79.39388303999993 43.72688799000008,-79.38650411999998 43.72843104000003,-79.38605303999998 43.728453,-79.38350711999993 43.727831010000045,-79.38223307999993 43.727607,-79.38185903999992 43.727536980000025,-79.38163511999994 43.726887,-79.37997515999996 43.725405960000046,-79.37955287999995 43.72433397000003,-79.378362 43.71836004000005,-79.38556811999996 43.71638697000003,-79.38884312999994 43.717956353000034,-79.39034495999994 43.71867603000004,-79.39776995999995 43.71962301000007,-79.39804211999996 43.720511040000076,-79.40142683999994 43.72151697000004,-79.40217383999999 43.725104010000045))',
          'POLYGON((-79.425351 43.63379604000005,-79.42735907999997 43.63892604000006,-79.41943907999996 43.640510670000026,-79.41127571999994 43.64026407000006,-79.41008591999997 43.63746804000004,-79.41221207999995 43.63734996000005,-79.425351 43.63379604000005))'
        ]
        //city: '1072'
      }
      */
      return search.getSqlObj(params, 'simple').then(function(sqlObj){
        return Property.prototype.executeMarkersSql(sqlObj, params)
          .then(function (result) {
            return result;
          });
      })
    });
  } else {
    return search.getSqlObj(params, 'simple').then(function(sqlObj) {
      return Property.prototype.executeMarkersSql(sqlObj, params)
        .then(function (result) {
          return result;
        });
    })
  }

};

Property.prototype.executeMarkersSql = function (sqlObj, params) {
  var Search = require(PATH + '/lib/search/property');
  var count = 0;

  return models.Property.findAndCountAll(sqlObj)
    .then(function (results) {
      count = results.count;
      return when.map(results.rows, function (row) {
        row.addField('label', __.roundPrice(row.price));
        row.deleteField('price');
        if (row.is_public === false && params.isAuthenticated === false) {
          row.privatizeField('label');
        }
        row.addField('type', row.PropertyTrpType.name);

        if (row.UserBookmarks && row.UserBookmarks.length > 0) {
          row.addField('favorite_id', row.UserBookmarks[0].id);
        } else {
          row.addField('favorite_id', null);
        }
        row.deleteField('PropertyTrpType');
        row.deleteField('PropertyType');
        row.deleteField('MainProvince');
        row.deleteField('EntityAreaCity');
        row.deleteField('EntityAreaHood');
        row.deleteField('UserBookmarks');
        return row.toJSON();
      }).then(function (listings) {
        var result = {};
        result.totalCount = count;
        result.currentPage = (parseInt(params.page) || 1);
        result.num = (parseInt(params.num) || Search.defaultLimit);
        result.listings = listings;
        return result;
      }).then(function (result) {
        // clustering
        if (params.hasOwnProperty('zoom_level')) {
          var Cluster = require(PATH + '/lib/cluster');
          var cluster = new Cluster();
          var listings = _.clone(result.listings);

          var clustered = cluster.clusterize(listings, params.zoom_level);
          if (clustered.markers.length) {
            result.listings = clustered.markers;
          } else {
            delete result.listings;
          }

          if (clustered.clusters.length) {
            result.clusters = clustered.clusters;
          }
        }

        return result;
      });
    }).catch(function (error) {
      return error;
    });
};

Property.prototype.getAutocomplete = function (params) {
  var Search = require(PATH + '/lib/search/property');
  var search = new Search();
  //var sqlObj = search.getSqlObj(params, 'autocomplete');

  return search.getSqlObj(params, 'autocomplete').then(function(sqlObj) {
    var count = 0;
    return models.Property.findAll(sqlObj).then(function (listings) {
      return when.map(listings, function (listing) {
        listing.deleteField('MainProvince');
        return listing.addUrl(true);
      }).then(function (listings) {
        var result = {};
//      result.totalCount = count;
        result.currentPage = (parseInt(params.page) || 1);
        result.num = (parseInt(params.num) || Search.defaultLimit);
        result.listings = listings;
        return result;
      });
    }).catch(function (error) {
      return error;
    });
  })
};

Property.prototype.getCount = function (params) {

  var Search = require(PATH + '/lib/search/property');
  var search = new Search();

  var countSqlObj = search.getCountSqlObj(params, 'autocomplete');

  return models.Property.count(countSqlObj).then(function (countResult) {
    return {'totalCount': countResult};
  });
};

Property.prototype.getSimple = function (params) {
  var Search = require(PATH + '/lib/search/property');
  var search = new Search();
  //var sqlObj = search.getSqlObj(params, 'simple');
  return search.getSqlObj(params, 'simple').then(function(sqlObj) {
    var count = 0;
    return models.Property.findAndCountAll(sqlObj).then(function (results) {
      count = results.count;
      return when.map(results.rows, function (result) {
        return result.addStockImages();

      }).then(function (listings) {
        var result = {};
        result.totalCount = count;
        if (_.has(params, 'offset')) {
          result.offset = parseInt(params.offset);
        } else if (_.has(params, 'page')) {
          result.currentPage = (parseInt(params.page) || 1);
        }
        result.num = (parseInt(params.num) || Search.defaultLimit);
        result.listings = listings;
        return result;
      });
    }).catch(function (error) {
      return error;
    });
  })
};

Property.prototype.getSummary = function (params) {

  var Search = require(PATH + '/lib/search/property');
  var search = new Search();
  var responseLevel = 'summary';
  if (_.has(params, 'response') && (Property.responseLevelAr.indexOf(params.response) != -1)) {
    responseLevel = params.response;
  }

  var self = this;
  var sqlObj;

  if (params.saved_search_id !== undefined) {
    var SavedSearch = new handlers[this.version]['saved-search']();

    return SavedSearch.getById(params.saved_search_id).then(function (savedSearch) {

      if (!savedSearch) {
        return;
      }

      var ss = savedSearch.toJSON();

      _.each(_.keys(models.SavedSearch.filterKeys), function (filterKey) {
        if (_.has(ss, filterKey) && ss[filterKey] != null) {
          params[models.SavedSearch.filterKeys[filterKey]] = ss[filterKey] + '';
        }
      });


      if (savedSearch.bounds !== null) {
        boundsObj = JSON.parse(savedSearch.bounds);
        params.bounds = boundsObj.x2 + ',' + boundsObj.y2 + ',' + boundsObj.x1 + ',' + boundsObj.y1;
      }
      
      //sqlObj = search.getSqlObj(params, responseLevel);
      return search.getSqlObj(params, responseLevel).then(function(sqlObj) {
        return Property.prototype.executeSummarySql(sqlObj, params)
          .then(function (result) {
            return result;
          });
      })
    });
  } else {
    //sqlObj = search.getSqlObj(params, responseLevel);
    return search.getSqlObj(params, responseLevel).then(function(sqlObj) {
      return Property.prototype.executeSummarySql(sqlObj, params)
        .then(function (result) {
          return result;
        });
    });
  }

};

Property.prototype.executeSummarySql = function (sqlObj, params) {
  var assetsNum = (params.assets_num) ? parseInt(params.assets_num) : null;
  var assetsExact = params.assets_exact == undefined || params.assets_exact == 1;
  var count = 0;
  return models.Property.findAndCountAll(sqlObj).then(function (results) {
    // TO FIX: count will be incorrect if params.assets_exact = 0
    // findAndCountAll doesn't know how to create a query surrounding the HAVING CLAUSE
    // & will return rows of numbers, none of which represent the number of rows returned in the response
    count = results.count;
    return when.map(results.rows, function (result) {
      //adding images and url
      var promise;
      if (result.is_public === false && params.isAuthenticated === false) {
        promise = result.addStockImages();
      } else {
        promise = result.addImages(assetsNum, assetsExact);
      }
      return when(promise).then(function (result) {
        if (result.is_public === false && params.isAuthenticated === false) {
          var fieldsToPrivatize = [
            'addr_street_num',
            'addr_street',
            'addr_unit_num',
            'addr_full',
            'price',
            'num_beds',
            'num_baths',
            'sqft'
          ];
          var url = result.addUrl();

          return when(url).then(function (result) {
            for (var p in fieldsToPrivatize) {
              result.privatizeField(fieldsToPrivatize[p]);
            }
            return result;
          });

        } else {
          return result.addUrl();
        }

      }).then(function (result) {
        var propAddress = result.addr_street_num + ' ' + result.addr_street;
        var propUnitNum = (result.addr_unit_num !== null) ? ' - ' + 'Apt. ' + result.addr_unit_num : '';
        result.addField('address', propAddress + propUnitNum);
        // moving City/Hood to the root level, removing EntityArea level
        result.addField('City', result.MainCity.dataValues);

        if (result.MainHood === null) {
          result.addField('Hood', '');
        } else {
          result.addField('Hood', result.MainHood.dataValues);

        }
        if (result.UserBookmarks && result.UserBookmarks.length > 0) {
          result.addField('favorite_id', result.UserBookmarks[0].id);
        } else {
          result.addField('favorite_id', null);
        }
        result.deleteField('MainHood');
        result.deleteField('MainCity');
        result.deleteField('EntityAreaCity');
        result.deleteField('EntityAreaHood');
        result.deleteField('UserBookmarks');
        result.deleteField('ResourceTemps');
        return result;
      });
    }).then(function (listings) {
      var result = {};
      result.totalCount = count;
      if (_.has(params, 'offset')) {
        result.offset = parseInt(params.offset);
      } else if (_.has(params, 'page')) {
        result.currentPage = (parseInt(params.page) || 1);
      }
      result.num = listings.length;
      result.listings = listings;
      return result;
    });
  }).catch(function (error) {
    return error;
  });

};

Property.prototype.getListview = function (params) {

  var Search = require(PATH + '/lib/search/property');
  var search = new Search();
  var responseLevel = 'listview';
  if (_.has(params, 'response') && (Property.responseLevelAr.indexOf(params.response) != -1)) {
    responseLevel = params.response;
  }
  var self = this;
  var sqlObj;

  if (params.saved_search_id !== undefined) {
    var SavedSearch = new handlers[this.version]['saved-search']();

    return SavedSearch.getById(params.saved_search_id).then(function (savedSearch) {

      if (!savedSearch) {
        return;
      }

      var ss = savedSearch.toJSON();

      _.each(_.keys(models.SavedSearch.filterKeys), function (filterKey) {
        if (_.has(ss, filterKey) && ss[filterKey] != null) {
          params[models.SavedSearch.filterKeys[filterKey]] = ss[filterKey] + '';
        }
      });


      if (savedSearch.bounds !== null) {
        boundsObj = JSON.parse(savedSearch.bounds);
        params.bounds = boundsObj.x2 + ',' + boundsObj.y2 + ',' + boundsObj.x1 + ',' + boundsObj.y1;
      }

      delete params.resale_on;
      //sqlObj = search.getSqlObj(params, responseLevel);
      return search.getSqlObj(params, responseLevel).then(function(sqlObj) {
        return Property.prototype.executeListviewSql(sqlObj, params)
          .then(function (result) {
            return result;
          });
      })
    });
  } else {
    //sqlObj = search.getSqlObj(params, responseLevel);
    return search.getSqlObj(params, responseLevel).then(function(sqlObj) {
      return Property.prototype.executeListviewSql(sqlObj, params)
        .then(function (result) {
          return result;
        });
    })
  }

};

Property.prototype.executeListviewSql = function (sqlObj, params) {
  var assetsNum = (params.assets_num) ? parseInt(params.assets_num) : null;
  var assetsExact = params.assets_exact == undefined || params.assets_exact == 1;
  var count = 0;
  return models.Property.findAndCountAll(sqlObj).then(function (results) {
    
    // TO FIX IF NEEDED: count will be incorrect if params.assets_exact = 0
    // findAndCountAll doesn't know how to create a query surrounding the HAVING CLAUSE
    // & will return rows of numbers, none of which represent the number of rows returned in the response
    count = results.count; 
    return when.map(results.rows, function (result) {
      //adding images and url
      var promise;
      if (result.is_public === false && params.isAuthenticated === false) {
        promise = result.addStockImages();
      } else {
        promise = result.addImages(assetsNum, assetsExact);
      }
      return when(promise).then(function (result) {
        if (result.is_public === false && params.isAuthenticated === false) {
          var fieldsToPrivatize = [
            'addr_street_num',
            'addr_street',
            'addr_unit_num',
            'addr_full',
            'price',
            'num_beds',
            'num_baths',
            'sqft',
            'lat',
            'lng',
            'taxes',
            'broker',
            'client_remarks'
          ];
          var url = result.addUrl();

          return when(url).then(function (result) {
            for (var p in fieldsToPrivatize) {
              result.privatizeField(fieldsToPrivatize[p]);
            }
            return result;
          });

        } else {
          return result.addUrl();
        }

      }).then(function (result) {
        var propAddress = result.addr_street_num + ' ' + result.addr_street;
        var propUnitNum = (result.addr_unit_num !== null) ? ' - ' + 'Apt. ' + result.addr_unit_num : '';

        var propDescription = result.client_remarks;
        if (propDescription !== '-') {
          propDescription = propDescription.substr(0, 200) + (result.is_public ? '...' : '');
        }

        result.addField('address', propAddress + propUnitNum);
        result.addField('description', propDescription);
        // moving City/Hood to the root level, removing EntityArea level
        result.addField('City', result.MainCity.dataValues);

        if (result.MainHood === null) {
          result.addField('Hood', '');
        } else {
          result.addField('Hood', result.MainHood.dataValues);

        }
        if (result.UserBookmarks && result.UserBookmarks.length > 0) {
          result.addField('favorite_id', result.UserBookmarks[0].id);
        } else {
          result.addField('favorite_id', false);
        }
        result.deleteField('client_remarks');
        result.deleteField('MainHood');
        result.deleteField('MainCity');
        result.deleteField('EntityAreaCity');
        result.deleteField('EntityAreaHood');
        result.deleteField('UserBookmarks');
        result.deleteField('ResourceTemps');
        return result;
      });
    }).then(function (listings) {
      var result = {};
      result.totalCount = count;
      if (_.has(params, 'offset')) {
        result.offset = parseInt(params.offset);
      } else if (_.has(params, 'page')) {
        result.currentPage = (parseInt(params.page) || 1);
      }
      result.num = listings.length;
      result.listings = listings;
      return result;
    });
  }).catch(function (error) {
    return error;
  });

};

Property.prototype.getSimilar = function (id, params) {
  if (params.offset === undefined) {
    params.offset = 0;
  }

  if (params.num === undefined) {
    params.num = 10;
  } else {
    params.num = Math.min(100, params.num);
  }

  var propertyParams = {key: id, responseLevel: 'simple'};

  return this.getById(propertyParams).then(function (prop) {

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
      + 'and property_trp_type_id=' + prop.property_trp_type_id + ' '
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

Property.prototype.getLandmarks = function (id, types, num) {
  var self = this;
  return models.Property.find(
    {
      where: {id: id},
      attributes: ['id', 'lat', 'lng']

    }).then(function (prop) {

      var Landmark = new handlers[self.version].landmark();

      return Landmark.getNearbyByBounds(prop.lat + ',' + prop.lng, num, types).then(function (res) {
        return res;
      });


    });
};

Property.prototype.getScores = function (id) {
  var self = this;
  return models.Property.find(
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

      if (prop.walk_score === null) {
        walkScore = Scores.getWalkScore(prop.addr_full, prop.lat, prop.lng).then(function (res) {
          if (res.status !== 1) {
            return 'Not Available';
          } else {
            return res.walkscore;
          }

        });
      } else {
        isWalkScoreCached = true;
        walkScore = prop.walk_score;
      }

      if (prop.transit_score === null) {
        transitScore = Scores.getTransitScore(prop.addr_city, prop.lat, prop.lng).then(function (res) {
          if (res.error !== undefined) {
            return 'Not Available';
          } else {
            return res.transit_score;
          }
        });
      } else {
        isTransitScoreCached = true;
        transitScore = prop.transit_score;
      }

      return when(walkScore).then(function (walk) {
        return when(transitScore).then(function (transit) {
          if (isWalkScoreCached === false || isTransitScoreCached === false) {
            prop.walk_score = (__.isInt(walk)) ? walk : null;
            prop.transit_score = (__.isInt(transit)) ? transit : null;
            prop.save({fields: ['walk_score', 'transit_score']});
          }
          return {walkscore: walk, transit_score: transit};
        });
      });
    });
};

exports = module.exports = Property;
