var when = require('when');
var errors = require(PATH + '/lib/errors');
function Subscription () {
}

Subscription.prototype.version = '1.0.0';

Subscription.prototype.getAllTypes = function () {
  return models.SubscriptionType.findAll();
};

Subscription.prototype.getByUserId = function (id) {
  return models.Subscription.findAll({
    where: {user_id: id},
    include: [
      {model: models.SubscriptionType, attributes: ['id', 'name', 'sys_name']},
      {model: models.SubscriptionSource, attributes: ['id', 'name', 'sys_name']},
      {model: models.UnsubscriptionSource, attributes: ['id', 'name', 'sys_name']}
    ]
  });
};

Subscription.prototype.getSourceByName = function (name) {
  return models.SubscriptionSource.find({where: {sys_name: name}});
};

Subscription.prototype.addAll = function (userId, sourceName, status) {

  if (!userId) {
    return 'User id is missing.';
  }

  var subscriptionStatus = (typeof status !== 'undefined') ? status : 1;
  var subscriptionParams = [];
  return this.getSourceByName(sourceName).then(function (source) {
    return Subscription.prototype.getAllTypes().then(function (subscriptionTypes) {
      _.each(subscriptionTypes, function (subscriptionType) {
        subscriptionParams.push({
          status: subscriptionStatus,
          user_id: userId,
          subscription_date: Date.now(),
          subscription_source_id: source.id,
          subscription_type_id: subscriptionType.id,
          created_on: Date.now(),
          updated_on: Date.now()
        });
      });
      return models.Subscription.bulkCreate(subscriptionParams);
    });
  });

};

Subscription.prototype.updateMultiple = function (userId, subscriptionsAr, trackingParams) {
  return when.map(subscriptionsAr, function (subscription) {
    return Subscription.prototype.update(subscription.id, _.omit(subscription, 'id'));
  }).then(function (result) {
    return models.User.findById(userId).then(function (user) {
      user.addEventParams(trackingParams, 'subscription');
      var Events = new handlers[Subscription.prototype.version].event();
      Events.create(user.dataValues.event_params, 'subscription');
      return result;
    });
  }).catch(function (err) {
    throw new errors.BadRequest(err.message);
  });
};

Subscription.prototype.update = function (id, params) {
  return models.Subscription.findById(id).then(function (subscription) {

    if (subscription.status !== params.status && (_.isBoolean(params.status) || params.status == 1 || params.status == 0)) {
      var updatedDate = Date.now();
      if (subscription.status == 0 && params.status == 1) {
        params.subscription_date = updatedDate;
      }

      if (subscription.status == 1 && params.status == 0) {
        params.unsubscription_date = updatedDate;
      }

      return subscription.updateAttributes(params).then(function (result) {
        return result;
      });
    }else {
      return subscription;
    }
  })
};

exports = module.exports = Subscription;
