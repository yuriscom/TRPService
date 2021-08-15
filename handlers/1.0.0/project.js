var http = require('http')
  , when = require('when')
  ;
function Project () {
}
Project.prototype.version = '1.0.0';
Project.responseLevelAr = ['full', 'summary', 'simple'];
Project.prototype.getCurrentVersion = function () {
  return _.last(__dirname.split('/'));
};

Project.prototype.getById = function (key, params) {
  if ((params.responseLevel === undefined) || (Project.responseLevelAr.indexOf(params.responseLevel) == -1)) {
    params.responseLevel = 'full';
  }
  if (params.type === undefined) {
    params.type = 'id';
  }

  var where = {};
  if(params.type === 'id'){
    where = {id: key};
  }else if(params.type === 'name'){
    where = {web_id: key};
  }

  var sqlObj = {
    //attributes: ['id','addr_full'],
    where: where,
    doSubQuery:true
  };

  switch (params.responseLevel.toLowerCase()) {
    case 'full':
    case 'summary':
      sqlObj.include = [
        {
          model: models.PreconUnit,
          as: 'PreconUnits',
          where: {hidden: 0, is_comprehensive: 1},
          required: false
        },
        { model: models.PreconSalesOffice },
        { model: models.PreconBuilder, as: 'PB',
          include: {
            model: models.Builder,
            attributes: ['name', 'web_id']
          }
        },
        { model: models.PreconStatus },
        { model: models.PreconPreconAmenity,
          as: 'PreconPreconAmenities',
          include: {
            model: models.PreconAmenity,
            as: 'PreconAmenity'
          }
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

      if (params.isAuthenticated === true) {
        sqlObj.include.push({
          model: models.UserBookmark,
          required: false,
          where: {user_id: params.authenticatedId, listing_type: 'presale', is_deleted: false}
        });
      }
      break;
    case 'simple':
      break;
  }


  return models.Precon.find(
    sqlObj
  ).then(function (project) {
      if (!project) {
        return {};
      }

      if (params.responseLevel == 'simple') {
        return project.toJSON();
      }

      if (project.UserBookmarks && project.UserBookmarks.length > 0) {
        project.addField('favorite_id', project.UserBookmarks[0].id);
      }else{
        project.addField('favorite_id', null);
      }

      if(project.MainProvince !== null) {
        project.MainProvince.addFeaturedUrl(false, 'project');
      }else{
        return {};
      }
      if(project.MainRegion !== null) {
        project.MainRegion.addFeaturedUrl(false, project.MainProvince.web_id, 'project');
      }else{
        return {};
      }
      if(project.MainCity !== null) {
        project.MainCity.addFeaturedUrl(false, project.MainProvince.web_id, 'project');
      }else{
        return {};
      }
      if(project.MainHood !== null) {
        project.MainHood.addFeaturedUrl(false, project.MainProvince.web_id, project.MainCity.web_id, 'project');
      }


      var units = [];
      _.each(project.PreconUnits, function (unit, index) {
        units[index] = when.promise(function (resolve, reject, notify) {
          resolve(unit.addImages(project));
        });
      });

      var amenities = [];
      _.each(project.PreconPreconAmenities, function (amenity, index) {
        units[index] = when.promise(function (resolve, reject, notify) {
          resolve(amenity.PreconAmenity.addImages(project));
        });
      });
      project.deleteField('UserBookmarks');
      return when(units, amenities).then(function () {
        return project.addImages().then(function (project) {
          return project.addLogo().then(function (project) {
            project.addUrl();
            return project.toJSON();
          });
        });
      });
    });
};

Project.prototype.getMarkers = function (params) {
  var Search = require(PATH + '/lib/search/project');
  var search = new Search();
  return search.getSqlObj(params, 'simple', params.is_exact).then(function (sqlObj) {

    return models.Precon.findAll(sqlObj).then(function (results) {
      var countSqlObj = search.getCountSqlObj(params, 'simple', params.is_exact);
      return models.Precon.count(countSqlObj).then(function (countResult) {
        var count = countResult;
        return when.map(results, function (row) {
          var type, label;
          if (row.is_vip_active == 1) {
            type = 'vip';
            label = row.addField('label', 'VIP');
          } else {
            type = 'project';
            label = row.addField('label', __.roundPrice(parseInt(row.price_min)) + '+');
          }

          if (row.UserBookmarks && row.UserBookmarks.length > 0) {
            row.addField('favorite_id', row.UserBookmarks[0].id);
          }else{
            row.addField('favorite_id', null);
          }
          row.deleteField('MainProvince');
          row.deleteField('price_min');
          row.addField('type', type);
          row.deleteField('is_vip_active');
          row.deleteField('PreconUnit');
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
    });
  });
};

Project.prototype.getSimple = function (params) {
  var Search = require(PATH + '/lib/search/project');
  var search = new Search();
  return search.getSqlObj(params, 'simple', params.is_exact).then(function (sqlObj) {
    return models.Precon.findAll(sqlObj).then(function (listings) {
      var countSqlObj = search.getCountSqlObj(params, 'simple', params.is_exact);
      return models.Precon.count(countSqlObj).then(function (countResult) {
        var result = {};
        result.totalCount = countResult;
        result.currentPage = (parseInt(params.page) || 1);
        result.num = (parseInt(params.num) || Search.defaultLimit);
        result.listings = listings;
        return result;
      }).catch(function (error) {
        return error;
      });
    });
  });
};

Project.prototype.getSummary = function (params) {
  var Search = require(PATH + '/lib/search/project');
  var search = new Search();
  var assetsNum = (params.assets_num) ? parseInt(params.assets_num) : null;
  var assetsExact = params.assets_exact === undefined || params.assets_exact == 1;

  return search.getSqlObj(params, 'summary', params.is_exact).then(function (sqlObj) {
    var count = 0;
    return models.Precon.findAll(sqlObj).then(function (results) {
      var countSqlObj = search.getCountSqlObj(params, 'summary', params.is_exact);
      return models.Precon.count(countSqlObj).then(function (countResult) {

         // TO FIX IF NEEDED: count will be incorrect if params.assets_exact = 0
        // findAndCountAll doesn't know how to create a query surrounding the HAVING CLAUSE
        // & will return rows of numbers, none of which represent the number of rows returned in the response
        count = countResult;
        return when.map(results, function (result) {
          //adding images and url
          return result.addImages(assetsNum, assetsExact).then(function (result) {

            // moving City/Hood to the root level, removing EntityArea level
            result.addField('City', result.MainCity);

            if(result.MainHood === null) {
              result.addField('Hood', '');
            }else{
              result.addField('Hood', result.MainHood);
            }

            result.addUrl();
            if (result.UserBookmarks && result.UserBookmarks.length > 0) {
              result.addField('favorite_id', result.UserBookmarks[0].id);
            }else{
              result.addField('favorite_id', null);
            }
            result.deleteField('MainProvince');
            result.deleteField('MainCity');
            result.deleteField('MainHood');
            result.deleteField('PreconUnit');
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
    });
  });
};


Project.prototype.getListview = function (params) {
  var Search = require(PATH + '/lib/search/project');
  var search = new Search();
  var assetsNum = (params.assets_num) ? parseInt(params.assets_num) : null;
  var assetsExact = params.assets_exact === undefined || params.assets_exact == 1;

  return search.getSqlObj(params, 'listview', params.is_exact).then(function (sqlObj) {
    var count = 0;
    return models.Precon.findAll(sqlObj).then(function (results) {
      var countSqlObj = search.getCountSqlObj(params, 'listview', params.is_exact);
      return models.Precon.count(countSqlObj).then(function (countResult) {

         // TO FIX IF NEEDED: count will be incorrect if params.assets_exact = 0
        // findAndCountAll doesn't know how to create a query surrounding the HAVING CLAUSE
        // & will return rows of numbers, none of which represent the number of rows returned in the response
        count = countResult;
        return when.map(results, function (result) {
          //adding images and url
          return result.addImages(assetsNum, assetsExact).then(function (result) {

            // moving City/Hood to the root level, removing EntityArea level
            result.addField('City', result.MainCity);

            if(result.MainHood === null) {
              result.addField('Hood', '');
            }else{
              result.addField('Hood', result.MainHood);
            }

            result.description = result.description.substr(0,200) + '...';
            result.addUrl();

            if (result.UserBookmarks && result.UserBookmarks.length > 0) {
              result.addField('favorite_id', result.UserBookmarks[0].id);
            }else{
              result.addField('favorite_id', null);
            }

            result.deleteField('MainProvince');
            result.deleteField('MainCity');
            result.deleteField('MainHood');
            result.deleteField('PreconUnit');
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
    });
  });
};

Project.prototype.getNearby = function (id, params) {
  if (params.offset === undefined) {
    params.offset = 0;
  }

  if (params.num === undefined) {
    params.num = 5;
  }
  return this.getById(id, params).then(function (project) {

    if (!project.hasOwnProperty('id')) {
      //todo: throw exception
      return {};
    }
    var bookmarksSql = '';
    if (params.isAuthenticated === true) {
      bookmarksSql = 'left join user_bookmark ub on precon.id = ub.listing_id and ub.user_id = '
                     + params.authenticatedId + ' and is_deleted = false and listing_type = \'presale\' ';
    }
    var distance = '(3956 * 2 *'
      + 'ASIN('
      + 'SQRT('
      + 'POWER('
      + 'SIN('
      + '(' + project.lat + '-abs(precon.lat)) * pi()/180 / 2'
      + '),2'
      + ')'
      + '+ COS('
      + project.lat + ' * pi()/180'
      + ')'
      + '* COS(pi()/180 * abs(precon.lat))'
      + '* POWER('
      + 'SIN(pi()/180 / 2 * (' + project.lng + ' - precon.lng))'
      + ', 2'
      + ')'
      + ')'
      + ')'
      + ')';

    var sql = 'select id, name, precon_status_name, price_min, price_max, lat, lng, '
        + 'is_vip_active, addr_hood, city_web_id, hood_web_id, '
        + 'addr_street, addr_city, addr_province, occupancy_year, maintenance_per_sqft, '
        + 'num_floors, num_units, builder_name, ' + ((params.isAuthenticated) ? 'favorite_id, ' : '')
        + '(distance*10) as dissimilarity '
        + 'from ('
        + 'select precon.id, precon.name, ps.name as precon_status_name, precon.price_min, '
        + 'precon.price_max, precon.lat, precon.is_vip_active, main_hood.name as addr_hood, '
        + 'precon.num_floors, precon.num_units, b.web_id as builder_name, precon.lng, precon.addr_street, '
        + 'precon.addr_city, precon.addr_province, precon.occupancy_year, precon.maintenance_per_sqft, '
        + 'eaCity.id as eaCityId, eaHood.id as eaHoodId, main_city.web_id as city_web_id, '
        + 'main_hood.web_id as hood_web_id, ' + ((params.isAuthenticated) ? 'ub.id as favorite_id, ' : '')
        + distance + ' as distance '
        + 'from precon '
        + 'inner join precon_status as ps on precon.precon_status_id = ps.id '
        + bookmarksSql
        + 'join map_entity_area as eaCity on eaCity.entity_id=precon.id and '
        + 'eaCity.entity_type=\'presale\' and eaCity.area_type=\'city\' '
        + 'join main_city on eaCity.area_id=main_city.id and eaCity.entity_type=\'presale\' and '
        + 'eaCity.area_type=\'city\' '
        + 'join map_entity_area as eaHood on eaHood.entity_id=precon.id and eaHood.entity_type=\'presale\' '
        + 'and eaHood.area_type=\'hood\' '
        + 'join main_hood on eaHood.area_id=main_hood.id and eaHood.entity_type=\'presale\' '
        + 'and eaHood.area_type=\'hood\' '
        + 'join precon_builder pb on precon.id = pb.precon_id '
        + 'join builder b on pb.builder_id = b.id '
        + 'where precon.lat is not null and precon.lng is not null '
        + 'and ps.name not in ("Sold Out") '
        + 'and precon.hidden = 0 '
        + 'and precon.id != ' + project.id + ' '
        + 'order by distance '
        + 'limit 1000 '
        + ') x '
        + 'order by dissimilarity asc '
        + 'limit ' + params.num + ' '
        + 'offset ' + params.offset + ' '
      ;

    return sequelize.query(sql).then(function (results) {
      return when.map(results, function (result) {
        if (!params.isAuthenticated) {
          result.favorite_id = null;
        }
        return models.Precon.getImages(result.id, 'project', params.assetsNum).then(
          function (images) {
            result.images = images;
            return result;
          }).then(function (result) {
            result.url = models.Precon.getUrl(result);
            return result;
          });
      });
    });
  });
};


Project.prototype.getAutocomplete = function (params) {
  var Search = require(PATH + '/lib/search/project');
  var search = new Search();

  return search.getSqlObj(params, 'autocomplete', params.is_exact).then(function (sqlObj) {

    return models.Precon.findAll(sqlObj).then(function (results) {

      var countSqlObj = search.getCountSqlObj(params, 'autocomplete', params.is_exact);

      return models.Precon.count(countSqlObj).then(function (countResult) {
        return when.map(results, function (row) {
          row.deleteField('PreconUnit');
          row.deleteField('MainProvince');
          row.addUrl(true);
          return row.toJSON();
        }).then(function (listings) {
          var result = {};
          result.totalCount = countResult;
          result.currentPage = (parseInt(params.page) || 1);
          result.num = (parseInt(params.num) || Search.defaultLimit);
          result.listings = listings;
          return result;
        });
      }).catch(function (error) {
        return error;
      });
    });
  });
};

Project.prototype.getCount = function(params) {

  var Search = require(PATH + '/lib/search/project');
  var search = new Search();

  var countSqlObj = search.getCountSqlObj(params, 'autocomplete', params.is_exact);

  return models.Precon.count(countSqlObj).then(function (countResult) {
    return {'totalCount':countResult};
  });
};

Project.prototype.getLandmarks = function (id, types, num) {
  var self = this;
  return models.Precon.find(
    {
      where: {id: id},
      attributes: ['id', 'lat', 'lng']

    }).then(function (proj) {

      var results;
      var Landmark = new handlers[self.version].landmark();
      return Landmark.getNearbyByBounds(proj.lat + ',' + proj.lng, num, types).then(function (res) {
        return res;
      });
    });
};


Project.prototype.getScores = function (id) {
  var self = this;
  return models.Precon.find(
    {
      where: {id: id},
      attributes: ['id', 'lat', 'lng', 'addr_street', 'addr_city', 'walk_score', 'transit_score']

    }).then(function (precon) {

      var results = [];
      var walkScore;
      var transitScore;
      var isWalkScoreCached = false;
      var isTransitScoreCached = false;

      var Scores = new handlers[self.version].walkscore();

      if(precon.walk_score === null){
        walkScore = Scores.getWalkScore(precon.addr_street, precon.lat, precon.lng).then(function (res) {
          if(res.status !== 1){
            return 'Not Available';
          }else{
            return res.walkscore;
          }

        });
      }else{
        isWalkScoreCached = true;
        walkScore = precon.walk_score;
      }

      if(precon.transit_score === null){
        transitScore = Scores.getTransitScore(precon.addr_city, precon.lat, precon.lng).then(function (res) {
          if(res.error !== undefined){
            return 'Not Available';
          }else{
            return res.transit_score;
          }
        });
      }else{
        isTransitScoreCached = true;
        transitScore = precon.transit_score;
      }

      return when(walkScore).then(function(walk){
        return when(transitScore).then(function(transit){
          if(isWalkScoreCached === false || isTransitScoreCached === false){
            precon.walk_score = (__.isInt(walk)) ? walk : null;
            precon.transit_score = (__.isInt(transit)) ? transit : null;
            precon.save({fields: ['walk_score', 'transit_score']});
          }
          return {walkscore: walk, transit_score: transit};
        });
      });
    });
};


exports = module.exports = Project;
