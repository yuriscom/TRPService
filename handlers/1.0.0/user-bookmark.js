var when = require('when');
var errors = require(PATH + '/lib/errors');
function UserBookmark () {
}

UserBookmark.prototype.version = '1.0.0';

UserBookmark.prototype.getByUserId = function (id, params) {

  var where = {
    user_id: id,
    is_deleted: false
  }
  if (!_.isEmpty(params) && params['entity_type'] !== undefined && params['entity_type'] !== '') {
    where.listing_type = params['entity_type'] == 'property' ? 'resale' : 'presale';
  }

  var propertyIdsAr = [];
  var projectIdsAr = [];
  return models.UserBookmark.findAll({
     where: where
  }).then(function (favoritesAr) {
    _.each(favoritesAr, function (favorite) {
      if(favorite.listing_type === 'resale'){
        propertyIdsAr.push(favorite.listing_id);
      }else{
        projectIdsAr.push(favorite.listing_id);
      }
    });

    var Property = new handlers[UserBookmark.prototype.version].property();
    var Project = new handlers[UserBookmark.prototype.version].project();

    var response = [];
    var responseObj = {};
    if(propertyIdsAr.length > 0){
      _.extend(params, {ids: propertyIdsAr.join()});
      response.push(Property.getSummary(params).then(function (response) {
        return when.map(response.listings, function (property) {
          _.each(favoritesAr, function (favorite) {
            if(favorite.listing_id === property.id && favorite.listing_type === 'resale'){
              property.addField('favorite_id', favorite.id);
            }
          });
          return property;
        }).then(function (properties) {
          responseObj.properties = properties;
          return properties;
        });
      }));
    }

    if(projectIdsAr.length > 0){
      _.extend(params, {ids: projectIdsAr.join()})
      response.push(Project.getSummary(params).then(function (response) {
        return when.map(response.listings, function (project) {
          _.each(favoritesAr, function (favorite) {
            if(favorite.listing_id === project.id && favorite.listing_type === 'presale'){
              project.addField('favorite_id', favorite.id);
            }
          });
          return project;
        }).then(function (projects) {
          responseObj.projects = projects;
          return projects;
        });
      }));
    }

    return when.all(response).then(function () {
      return responseObj;
    });
  });
};

UserBookmark.prototype.add = function (userId, entityType, entityId) {
  var where = {id: entityId};
  var entityObj;
  var entityTypeMap = {property: 'RESALE', project: 'PRESALE'};

  if(entityType == 'property') {
    entityObj = models.Property;
    where.property_status_id = 1;
  }else{
    entityObj = models.Precon;
    where.hidden = false;
  }

  return entityObj.find({
    where: where,
    include: [
      {
        model: models.UserBookmark,
        where: {user_id: userId, listing_type: entityTypeMap[entityType], listing_id: entityId},
        required: false
      }
    ]
  }).then(function (entity) {
    if(!entity) {
      throw entityType + ' (' + entityId + ') does not exist';
    }
    return entity;
  }).then(function (entity) {
    if(entity.UserBookmarks.length > 0){
      if(entity.UserBookmarks[0].is_deleted == 0) {
        return entity.UserBookmarks[0];
      }else{
        return UserBookmark.prototype.update(entity.UserBookmarks[0].id, userId, {is_deleted: false});
      }
    }
    return models.UserBookmark.build({
       user_id: userId,
       listing_id: entity.id,
       listing_type: entityTypeMap[entityType],
       created_on: new Date()
     }).save().catch(function (err) {
        throw err;
    });
  }).catch(function (err) {
    throw err;
  });

};

UserBookmark.prototype.update = function (id, userId, params) {
  return models.UserBookmark.findOne({
     where: {id: id, user_id: userId}
   }).then(function (favorite) {
    if(!favorite){
      throw new errors.BadRequest('No records found using user id: '+ userId + ' and favorite id: '+ id);
    }

    if(!_.isBoolean(params.is_deleted) && (params.is_deleted != 1 && params.is_deleted != 0)){
      throw new errors.BadRequest('wrong data type on field is_deleted. Must be 0, 1, or boolean');
    }

    params.updated_on = Date.now();
    // odd key validation requires listing_type field when updating
    params.listing_type = favorite.listing_type.toUpperCase();
    return favorite.updateAttributes(params).then(function (result) {
      return result;
    });
  });
};

exports = module.exports = UserBookmark;
