var environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , when = require('when');

function Event () {
}

Event.prototype.version = '1.0.0';

Event.prototype.get = function (params) {
  var query = {};
  query.where = {};

  if (params.num) {
    query.limit = params.num;
  }
  if (params.max_attempts) {
    if(params.max_attempts == 0) {
      query.where.attempts = null;
    }else{
      query.where.attempts = {lt: params.max_attempts};
    }
  }
  if (params.status) {
    query.where.status = params.status;
  }
  if (params.order_by) {
    var orderAr = params.order_by.split('|');
    var paramsAr = [];

    if(orderAr.length > 1){
      _.each(orderAr, function(value, key){
        paramsAr.push(value.split(','));
      });
    }else{
      paramsAr.push(params.order_by.split(','));
    }
    query.order = paramsAr;
  }

  query.include = [
    {model: models.MarketoEventType, attributes: ['id', 'name', 'sys_name']}
  ];

  return models.MarketoEvent.findAndCountAll(query).then(function (events) {
    return when.map(events.rows, function (event) {
      var promise;
      switch (event.ext_table) {
        case 'Contact':
          promise = models.Contact.findById(event.ext_id).then(function (result) {
            return result;
          });
          break;
        case 'NA':
        case 'SavedSearch':
          promise = models.SavedSearch.findById(event.ext_id).then(function (result) {
            return result;
          });
          break;
        case 'User':
          promise = models.User.find({}).then(function (result) {
            return result;
          });
          break;
      }

      return when(promise).then(function (result) {
        event.dataValues.entity = result;
        return event;
      });

    }).then(function (rows) {
      return {count:events.count, events:rows};
    });
  });
};

Event.prototype.getOne = function (params) {
  var query = {};
  query.where = {};

  if (params.status) {
    query.where.status = params.status;
  }
  if (params.max_attempts) {
    if(params.max_attempts == 0) {
      query.where.attempts = null;
    }else{
      query.where.attempts = {lt: params.max_attempts};
    }
  }
  if (params.order_by) {
    var orderAr = params.order_by.split('|');
    var paramsAr = [];

    if(orderAr.length > 1){
      _.each(orderAr, function(value, key){
        paramsAr.push(value.split(','));
      });
    }else{
      paramsAr.push(params.order_by.split(','));
    }
    query.order = paramsAr;
  }
  query.include = [
    {model: models.MarketoEventType, attributes: ['id', 'name', 'sys_name']}
  ];

  return sequelize.transaction(function (t) {
    query.transaction = t;
    query.lock = t.LOCK;
    return models.MarketoEvent.findOne(query).then(function (event) {
      if (event === null) {
        return {};
      }
      var promise;
      switch (event.ext_table) {
        case 'Contact':
          promise = models.Contact.find({
            where: {id: event.ext_id},
            include: [{model: models.ContactSource}, {model: models.ContactTool}]
          }).then(function (result) {
            var subEntity;
            if (result.prop_id) {
              var property = new handlers[params.ver].property() ;
              subEntity = property.getById({key:result.prop_id});
            }
            if (result.precon_id) {
              var project = new handlers[params.ver].project();
              subEntity = project.getById(result.precon_id, {});
            }
            if (result.agent_profile_id) {
              var agent = new handlers[params.ver].agent();
              subEntity = agent.getById(result.agent_profile_id);
            }
            return when(subEntity).then(function (subEntity) {
              result.dataValues.subEntity = subEntity;
              return result;
            });
          });
          break;
        case 'NA':
        case 'SavedSearch':
          promise = models.SavedSearch.find({
            where: {id: event.ext_id},
            include: [
              {model: models.User}
            ]
          }).then(function (result) {
            return result;
          });
          break;
        case 'User':
          promise = models.User.find({
            where: {id: event.ext_id},
            include: [
              {model: models.Subscription, include: [{model: models.SubscriptionType}]}]
          }).then(function (result) {
            return result;
          });
          break;
      }
      return when(promise).then(function (result) {
        event.status = 'processing';
        event.attempts = event.attempts+1;
        event.save({transaction: t});
        event.dataValues.entity = result;
        return event;
      });
    });
  });
};

Event.prototype.create = function (params, type) {
  var self = this;
  var event = {};
  return models.MarketoEventType.find({
    where:
    {
      sys_name: type
    }
  }).then(function(eventType){
    var date = new Date;
    event.marketo_event_type_id = parseInt(eventType.dataValues.id);
    event.updated_on = date.toGMTString();
    _.each(params, function(param, key){
      event[key] = param;
    });

    switch(type){
      case 'forgot-password': //TODO: refactor and make create event from user handler instead of here.
        var User = new handlers[self.version].user();
        return User.getByEmail(params['email']).then(function (user){
          user.generateEvent(params, 'forgot-password');
          user.save(user);
          var ext_params = {forgot_password_url: encodeURI(environment.clients.web.url+'/authenticate/?token='+user.dataValues.forgot_password_token+'#resetpassword')};
          event.ext_table = 'User';
          event.ext_id = user.dataValues.id;
          event.ext_params = JSON.stringify(ext_params);
          event.email = user.dataValues.email;

        }).then(function (){
          return models.MarketoEvent.build(event).save().catch(function (err){
            return err;
          });
        });
        break;
      case 'lead-request':
        break;
      case 'prospect-match':
        break;
      default:
        break;
    }

    return models.MarketoEvent.build(event).save().catch(function (err){
      return err;
    });

  }).catch(function(err){
    throw err;
  });
};

Event.prototype.update = function (id, params) {
  return models.MarketoEvent.findById(id).then(function (event) {
    _.each(Object.keys(event.dataValues), function (key) {
      if(params.hasOwnProperty(key)){
        if(key == 'created_on' || key == 'updated_on' || key == 'locked_on' || key == 'locked_until'){
          params[key] = Date(params[key]);
        }
        event[key] = params[key];
      }
    });
    return event.save().catch(function (err){
      throw err;
    });
  }).catch(function (err) {
    throw err;
  });
};

// assume the client is smart
Event.prototype.createLog = function (id, params) {
  var values = {};
  return models.MarketoEvent.findById(id).then(function (event){
    if (event == {} || typeof(event) == undefined) {
      return;
    }

    values['marketo_event_id'] = event.id;
    values['status'] = event.status == 'PUSHED' ? 'RECORDED' : 'UNRECORDED';
    values['email'] = event.email;
    values['request'] = params.request ? JSON.stringify(params.request) : null; // error check
    values['response'] = params.response ? JSON.stringify(params.response) : null; // error check
    values['error'] = params.error ? JSON.stringify(params.error) : null;

    // insert record into marketo push table
    return models.MarketoEventPush.build(values).save().then(function(pushedEvent) {
      return pushedEvent;

    }).catch(function(err) {
      throw err;
    });
    
  }).catch(function (err){
    throw err;
  });
};

exports = module.exports = Event;
