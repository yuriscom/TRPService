var when = require('when');
var errors = require(PATH + '/lib/errors');
function SavedSearch() {
}

SavedSearch.prototype.version = '1.0.0';

SavedSearch.prototype.getOne = function (order_by) {

  if (order_by === undefined) {
    order_by = ['last_checked', 'asc']; // change to last_checked
  }

  return sequelize.transaction(function (t) {
    return models.SavedSearch.find({
      order: [order_by],
      include: [
        {
          model: models.User,
          attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'gender', 'role_id'],
          as: 'User'
        },
        {
          model: models.SavedSearchPropertyHood,
          attributes: ['id'],
          include: [{model: models.MainHood, attributes: ['id', 'name', 'web_id'], as: 'Hood'}],
          as: 'Hoods'
        },
        {
          model: models.MainCity,
          attributes: ['id', 'name', 'web_id'],
          as: 'City'
        }
      ],
      limit: 1
    }, {transaction: t, lock: t.LOCK.SHARE}).then(function (row) {
      var date = new Date();
      var last_checked = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      row.last_checked = last_checked;
      row.deleteField("polygon");
      row = row.flatAreaNames();
      return row.save({transaction: t});
    });
  }).then(function (result) {
    return result;
  }).catch(function (err) {
    throw err;
  });
};

SavedSearch.prototype.run = function (id, additionalFilters) {
  additionalFilters = (_.isObject(additionalFilters) ? additionalFilters : {});


  var controllers = handlers[this.version];
  var property = new controllers.property();
  var params = _.extend({saved_search_id: id}, additionalFilters);
  var listings = [];
  var promises = [];
  promises.push(property.getMarkers(params).then(function (result) {
      //listings.push.apply(listings, result.listings);
      if (result.totalCount > result.num) {
        var numPages = parseInt(Math.ceil(result.totalCount / result.num));

        for (var i = 2; i <= numPages; i++) {
          promises.push(property.getMarkers(_.extend(params, {page: i})));
        }
      }
      return result;
    })
  );

  return when.all(promises).then(function (res) {
    res.forEach(function (newResult) {
      listings.push.apply(listings, newResult.listings);
    })

    return listings;
  })

}

SavedSearch.prototype.changelog = function (id, since, num) {
  var changelog = [];
  return this.run(id, {since: since}).then(function (listings) {
    for (var i = 0; i < listings.length; i++) {
      if (num && changelog.length >= num) {
        break;
      }
      var listing = listings[i];
      changelog.push({id: listing.id, created_on: listing.created_on, listingChangelog: listing.ListingChangelogs})
    }

    return changelog;
  })
}

SavedSearch.prototype.getByUserId = function (id) {
  return models.SavedSearch.findAll({
    where: {user_id: id},
    include: [
      {
        model: models.MainCity,
        attributes: ['id', 'name', 'web_id'],
        as: 'City'
      },
      {
        model: models.SavedSearchPropertyHood,
        attributes: ['id'],
        include: [{model: models.MainHood, attributes: ['id', 'name', 'web_id'], as: 'Hood'}],
        as: 'Hoods'
      }
    ]
  }).then(function (result) {

    return when.map(result, function (savedSearchObj) {
      savedSearchObj.deleteField('polygon');
      savedSearchObj = savedSearchObj.addFilters();
      return savedSearchObj;
      /*
       return savedSearchObj.addFilters().then(function (savedSearch) {
       return savedSearch;
       });
       */
    });
  }).catch(function (err) {
    return err;
  });
};

SavedSearch.prototype.create = function (params) {
  if (!params.user_id === null) {
    return 'Missing user_id field';
  }

  var polygonText = null;
  var seqPolygon = null;

  if (params.polygons) {
    if (_.isArray(params.polygons) && params.polygons.length) {
      var coordsAr = [];
      params.polygons.forEach(function(poly){
        var match = /^polygon\((.*)\)$/i.exec(poly);
        if (match.length == 2) {
          coordsAr.push(match[1]);
        }
      })
      if (coordsAr.length == params.polygons.length) {
        // valid
        polygonText = JSON.stringify(params.polygons);
        seqPolygonText = "POLYGON(" + coordsAr.join(",") + ")";
        seqPolygon = sequelize.fn("PolygonFromText", seqPolygonText);
      }
    }
  } else if (params.bounds) {
    var bounds = {
      x1: params.bounds.northeast.lat,
      y1: params.bounds.northeast.lng,
      x2: params.bounds.southwest.lat,
      y2: params.bounds.southwest.lng
    };

    polygonText = "POLYGON((" + bounds.y1 + " " + bounds.x1 + "," + bounds.y2 + " " + bounds.x1 + "," + bounds.y2 + " " + bounds.x2 + ", " + bounds.y1 + " " + bounds.x2 + "," + bounds.y1 + " " + bounds.x1 + "))";
    seqPolygon = sequelize.fn("PolygonFromText", polygonText);
  }

  if (params.hood_id) {
    params.hood_id = params.hood_id + '';
  }

  var date = new Date;
  var values = {
    user_id: params.user_id,
    name: params.name,
    polygon_text: polygonText,
    polygon: seqPolygon,
    city_id: (!params.city_id) ? null : params.city_id,
    hood_ids: (!params.hood_id) ? null : params.hood_id,
    min_price: (!params.min_price) ? null : params.min_price,
    max_price: (!params.max_price) ? null : params.max_price,
    beds: (!params.beds) ? null : params.beds,
    baths: (!params.baths) ? null : params.baths,
    property_type: (!params.property_type) ? null : params.property_type,
    notification_frequency: (!params.notification_frequency) ? 'daily' : params.notification_frequency,
    updated_on: params.updated_on || date.toGMTString(),
    created_on: params.created_on || date.toGMTString(),
    last_checked: params.last_checked || date.toGMTString(),
    last_sent: params.last_sent || date.toGMTString()
  };


  var track_info = {};
  _.each(params, function (value, key) {
    if (/^(track_)/.test(key)) {
      track_info[key] = value;
    }
  });

  values.track_info = JSON.stringify(track_info);
  var self = this;

  try {
    return sequelize.transaction(function (t) {
      return models.SavedSearch.build(values).save({transaction: t}).then(function (result) {
        result.addEventParams(params, 'prospect-match');
        var Events = new handlers[self.version].event();
        Events.create(result.dataValues.event_params, 'prospect-match');
        result.deleteField('event_params');

        return result;
      }).then(function (result) {
        if (params.property_type) {
          var promises = [];
          var typesAr = _.compact(params.property_type.split(","));
          for (var i = 0; i < typesAr.length; i++) {
            var type = typesAr[i];
            var ptValues = {
              saved_search_id: result.id,
              property_type: type
            }

            promises.push(models.SavedSearchPropertyType.build(ptValues).save({transaction: t}));
          }

          return Promise.all(promises).then(function (ok) {
            return result;
          })

        } else {
          return result;
        }
      }).then(function (result) {
        if (params.hood_id) {
          var promises = [];
          var hoodsAr = params.hood_id.split(",");
          for (var i = 0; i < hoodsAr.length; i++) {
            var hoodId = hoodsAr[i];
            var hValues = {
              saved_search_id: result.id,
              hood_id: hoodId
            }

            promises.push(models.SavedSearchPropertyHood.build(hValues).save({transaction: t}));
          }

          return Promise.all(promises).then(function (ok) {
            return result;
          })

        } else {
          return result;
        }
      })

    }).then(function (result) {
      // transaction committed
      return result;
    }).catch(function (err) {
      // rollback
      throw(err);
    });
  } catch (e) {
    console.log(e);
    throw e;
  }


};

SavedSearch.prototype.update = function (id, params) {
  if (params.hood_id) {
    params.hood_id = params.hood_id + '';
  }

  var map = {"hood_ids":"hood_id"};
  return models.SavedSearch.findById(id).then(function (result) {
    _.each(Object.keys(result.dataValues), function (key) {
      var paramsKey = map[key] || key;
      if (params.hasOwnProperty(paramsKey)) {
        if (key == 'last_sent' || key == 'last_checked') {
          params[paramsKey] = Date(params[paramsKey]);
        }

        result[key] = params[paramsKey];
      }
    });

    if (_.has(params,'bounds')) {
      var bounds = {
        x1: params.bounds.northeast.lat,
        y1: params.bounds.northeast.lng,
        x2: params.bounds.southwest.lat,
        y2: params.bounds.southwest.lng
      };

      var polygonText = "POLYGON((" + bounds.y1 + " " + bounds.x1 + "," + bounds.y2 + " " + bounds.x1 + "," + bounds.y2 + " " + bounds.x2 + ", " + bounds.y1 + " " + bounds.x2 + "," + bounds.y1 + " " + bounds.x1 + "))";
      var seqPolygon = sequelize.fn("PolygonFromText", polygonText);
      result.polygon_text = polygonText;
      result.polygon = seqPolygon;
    } else {
      result.deleteField('polygon_text');
      result.deleteField('polygon');
    }

    return sequelize.transaction(function (t) {
      return result.save({transaction: t}).then(function (result) {
        if (_.has(params, 'property_type')) {
          return models.SavedSearchPropertyType.destroy(
            {
              transaction: t,
              where: {
                saved_search_id: id
              }
            }).then(function (result) {
              var promises = [];
              var typesAr = params.property_type.split(",");
              for (var i = 0; i < typesAr.length; i++) {
                var type = typesAr[i];
                var ptValues = {
                  saved_search_id: id,
                  property_type: type
                }

                promises.push(models.SavedSearchPropertyType.build(ptValues).save({transaction: t}));
              }

              return Promise.all(promises).then(function (ok) {
                return result;
              })
            })


        } else {
          return result;
        }
      }).then(function (result) {
        if (_.has(params, 'hood_id')) {
          return models.SavedSearchPropertyHood.destroy(
            {
              transaction: t,
              where: {
                saved_search_id: id
              }
            }).then(function (result) {
              var promises = [];
              var hoodsAr = params.hood_id.split(",");
              for (var i = 0; i < hoodsAr.length; i++) {
                var hoodId = hoodsAr[i];
                var hValues = {
                  saved_search_id: id,
                  hood_id: hoodId
                }

                promises.push(models.SavedSearchPropertyHood.build(hValues).save({transaction: t}));
              }

              return Promise.all(promises).then(function (ok) {
                return result;
              })
            })
        } else {
          return result;
        }
      })
    }).then(function (result) {
      // transaction committed
      return result;
    }).catch(function (err) {
      // rollback
      throw(err);
    });

  }).catch(function (err) {
    throw err;
  });

};

SavedSearch.prototype.deleteAllFromUser = function (userId) {
  return models.SavedSearch.destroy(
    {
      where: {
        user_id: userId
      }
    }).then(function (result) {
      return result;
    });
};

SavedSearch.prototype.delete = function (id, userId) {
  return models.SavedSearch.destroy({
    where: {id: id, user_id: userId}
  }).then(function (result) {
    return Boolean(result);
  }).catch(function (err) {
    return err;
  });
};

SavedSearch.prototype.getById = function (id) {
  return models.SavedSearch.find({
    where: {id: id}, include: {
      model: models.User,
      attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'gender', 'role_id'],
      as: 'User'
    }
  }).then(function (result) {
    return result;
  });
};

SavedSearch.prototype.getByListingId = function (id, listingType) {
  var listingObj;
  var handler;
  if (listingType === 'exclusive') {
    listingObj = models.ExclusiveProperty.findById(id);
    handler = new handlers[this.version]['exclusive-property']();
  }
  if (listingType === 'property') {
    listingObj = models.Property.findById(id);
    handler = new handlers[this.version]['property']();
  }

  return listingObj.then(function (listing) {
    if (!listing) {
      throw new errors.BadRequest('No Property found using id = ' + id);
    }
    return models.SavedSearch.findAll({
      attributes: ['id'],
      include: [
        {model: models.User, attributes: ['id', 'email']}
      ]
    }).then(function (savedSearchAr) {
      console.log('Total Saved Searches: ' + savedSearchAr.length);
      var response = [];
      var idCheck = false;

      _.each(savedSearchAr, function (savedSearch, key) {
        response[key] = handler.runSavedSearch(savedSearch.id).then(function (resultAr) {
          if (!resultAr) return;
          idCheck = resultAr.some(function (result) {
            return result.id == listing.id
          });
          if (idCheck === true) {
            return savedSearch.User.email;
          }
        }).catch(function (err) {
          console.log(err);
        });
      });
      return when.all(response).then(function (response) {
        return _.uniq(_.without(response, null, undefined, ''));
      });
    });

  });
};

exports = module.exports = SavedSearch;
