var restify = require('restify')
  , versions = [ '1.0.0', '1.0.1' ]
  , errors = require(PATH + '/lib/errors')
  , restifyValidation = require('node-restify-validation')
  , response = require(PATH + '/lib/http/response')
  , when = require('when')
  , passport = require('passport')
  , oauth2 = require(PATH + '/lib/oauth/oauth2')
//, handlers = __.requireDir(PATH + "/handlers")
  , Geometry = require(PATH + '/lib/geometry')
  , environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , cacheManager = require('cache-manager')
  , memcached = cacheManager.caching({
    store: require('cache-manager-memcached'),
    servers: [environment.caching.memcache.host+':'+environment.caching.memcache.port],
    ttl: environment.caching.memcache.ttl
   });

require(PATH + '/lib/oauth/auth');
handlers = [];
__.requireDir(PATH + '/handlers', handlers);

module.exports = exports = function ( server) {
  server
    .pre(restify.pre.sanitizePath())
    .use(restify.bodyParser())
    .use(passport.initialize())
    .use(function checkVersion (req, res, next) {
      var urlPieces = req.url.replace(/^\/+/, '').split('/');
      if (urlPieces[0] == 'latest') {
        req.header('Accept-Version', urlPieces[0]);
        req.params.ver = versions[versions.length - 1];
        return next();
      }

      if (versions.indexOf(urlPieces[0]) > -1) {
        req.header('Accept-Version', urlPieces[0]);
        return next();
      }
      return next(new errors.BadRequest('Invalid Version Specifier'));
    })
    .use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      return next();
    })
    .use(restify.queryParser())
    .use(restify.CORS())
    .use(restify.fullResponse())
    .use(restifyValidation.validationPlugin({ errorsAsArray: false }))
    .use(restify.gzipResponse());

  // handle OPTIONS request.
  server.opts(/\.*/, function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.send(generateResponse());
  });

  server.post(
    {
      name: 'token',
      path: '/:ver/sessions'
    }, oauth2.token);

  server.get(
    {
      url: '/:ver/users/:key',
      validation: {
        key: { isRequired: true, scope: 'path' },
        role: { isRequired: true, isInt: true, scope: 'query' },
        response: {isRequired: false, isIn: ['email-check', 'full', 'token-check'], scope: 'query'},
        display: {isRequired: false, isIn:[0,1], scope: 'query'}
      }
    }, function (req, res, next) {
      var User = new handlers[req.params.ver].user();
      if(req.params.response == null || req.params.response == undefined){
        req.params.response = 'email-check';
      }
      var promise;
      if(req.params.response){
        switch (req.params.response) {
          case 'email-check':
            promise = User.doesEmailExist(req.params.key, req.params.role, Boolean(req.params.display));
            break;
          case 'full':
            promise = User.getByEmail(req.params.key, req.params.role);
            break;
          case 'token-check':
            promise = User.getByToken(req.params.key, req.params.role);
            break;
        }
      }
      promise.then(function (result) {
        res.send(generateResponse(result));
      });

    }
  );

  server.put(
    {
      url: '/:ver/users/:key',
      validation: {
        key: { isRequired: true, scope: 'path' },
        type: { isRequired: false, isIn: ['changepassword', 'forgotpassword', 'validation', 'standard'], scope: 'query'}
      }
    }, function (req, res, next) {
      var User = new handlers[req.params.ver].user();
      var promise;
      if(req.params.type){
        switch (req.params.type) {
          case 'standard':
            promise = User.update(req.params.key, JSON.parse(req.body), false);
            break;
          case 'changepassword':
            promise = User.update(req.params.key, JSON.parse(req.body), true);
            break;
          case 'forgotpassword':
            promise = User.update(req.params.key, JSON.parse(req.body), false);
            break;
          case 'validation':
            var params = _.omit(req.params, 'ver');
            promise = User.validate(params);
            break;
          default:
            promise = User.update(req.params.key, JSON.parse(req.body), false);
            break;
        }
      }
      promise.then(function (result) {
        res.send(generateResponse(result));
      });

    }
  );

  server.post(
    {
      url: '/:ver/users',
      validation: {
        full_name: { isRequired: true, scope: 'post' },
        email: { isRequired: true, isEmail: true, scope: 'post' },
        password: { isRequired: true, scope: 'post' },
        subscription_source: { isRequired: true, scope: 'post' }
      }
    }, function (req, res, next) {

      var User = new handlers[req.params.ver].user();

      var params = _.omit(req.params, 'ver');

      User.add(params).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/users/:id/subscriptions',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' },
        backdoor: { isRequired: false, isIn: [0,1], scope: 'query' },
      }
    }, ensureAuthenticated, function (req, res, next) {

      if(req.params.backdoor != 1){
        if(req.params.authenticatedId !== parseInt(req.params.id)){
          return res.send(new errors.UnauthorizedRequest());
        }
      }

      var Subscription = new handlers[req.params.ver].subscription();

      var userId = req.params.id;

      Subscription.getByUserId(userId).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.put(
    {
      url: '/:ver/users/:id/subscriptions',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' },
        backdoor: { isRequired: false, isIn: [0,1], scope: 'query' }
      }
    }, ensureAuthenticated, function (req, res, next) {

      if(req.params.backdoor != 1){
        if(req.params.authenticatedId !== parseInt(req.params.id)){
          return res.send(new errors.UnauthorizedRequest());
        }
      }

      var Subscription = new handlers[req.params.ver].subscription();

      var data = (typeof req.body == 'string') ? JSON.parse(req.body) : req.body;
      Subscription.updateMultiple(req.params.id, data.subscriptions, data.tracking).then(function (result) {
        res.send(generateResponse(result));
      }).catch(function (err) {
        return res.send(err);
      });
    }
  );

  server.put(
    {
      url: '/:ver/subscriptions',
      validation: {
      }
    }, function (req, res, next) {

      var Subscription = new handlers[req.params.ver].subscription();
      var data = (typeof req.body == 'string') ? JSON.parse(req.body) : req.body;

      Subscription.updateMultiple(data).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/users/:id/favorites',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' },
        entity_type: {isRequired: false, isIn: ['property', 'project'], scope: 'query'}
      }
    }, ensureAuthenticated, function (req, res, next) {

      if(req.params.authenticatedId !== parseInt(req.params.id)){
        return res.send(new errors.UnauthorizedRequest());
      }

      var UserBookmark = new handlers[req.params.ver]['user-bookmark']();

      var userId = req.params.id;

      UserBookmark.getByUserId(userId, req.params).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.post(
    {
      url: '/:ver/users/:id/favorites',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' }
      }
    }, ensureAuthenticated, function (req, res, next) {

      if(req.params.authenticatedId !== parseInt(req.params.id)){
        return res.send(new errors.UnauthorizedRequest());
      }

      var UserBookmark = new handlers[req.params.ver]['user-bookmark']();

      var userId = req.params.id;
      var data = (typeof req.body == 'string') ? JSON.parse(req.body) : req.body;
      if((data && (!data.entity_type || !data.entity_id)) || !data) {
        return res.send(new errors.BadRequest('Missing params'));
      }

      UserBookmark.add(userId, data.entity_type, data.entity_id).then(function (result) {
        res.send(generateResponse(result));
      }).catch(function (err) {
        res.send(new errors.BadRequest(err));
      });
    }
  );

  server.put(
    {
      url: '/:ver/users/:user_id/favorites/:favorite_id',
      validation: {
        user_id: { isRequired: true, isInt: true, scope: 'path' },
        favorite_id: { isRequired: true, isInt: true, scope: 'path' }
      }
    }, ensureAuthenticated, function (req, res, next) {

      if(req.params.authenticatedId !== parseInt(req.params.user_id)){
        return res.send(new errors.UnauthorizedRequest());
      }

      var UserBookmark = new handlers[req.params.ver]['user-bookmark']();

      var data = (typeof req.body == 'string') ? JSON.parse(req.body) : req.body;

      UserBookmark.update(req.params.favorite_id, req.params.user_id, data).then(function (result) {
        res.send(generateResponse(result));
      }).catch(function (err) {
        res.send(err);
      });
    }
  );

  server.del(
      {
        url: '/:ver/users/:username/saved-searches',
        validation: {
          username: { isRequired: true, isEmail: true, scope: 'path' }
        }
      }, function (req, res, next) {
        var User = new handlers[req.params.ver].user();
        var SavedSearch = new handlers[req.params.ver]['saved-search']();
        User.getByEmail(req.params.username).then(function (user) {
          SavedSearch.deleteAllFromUser(user.id).then(function(result){
            res.send(generateResponse(result));
          });
        });
      }
  );

  server.del(
      {
        url: '/:ver/saved-searches/:id',
        validation: {
          id: { isRequired: true, isInt: true, scope: 'path' }
        }
      }, function (req, res, next) {
        var SavedSearch = new handlers[req.params.ver]['saved-search']();
        SavedSearch.delete(req.params.id).then(function (result) {
          res.send(generateResponse(result));
        });
      }
  );

  server.get(
    {
      url: '/:ver/saved-searches/:id/run',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' }
      }
    }, function (req, res, next) {
      var SavedSearch = new handlers[req.params.ver]['saved-search']();
      SavedSearch.run(req.params.id).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/saved-searches/:id/changelog',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' },
        since: { isRequired: false, scope: 'query' },
        num: { isRequired: false, isInt: true, scope: 'query' }
      }
    }, function (req, res, next) {
      var SavedSearch = new handlers[req.params.ver]['saved-search']();
      var sinceTimestamp = req.params.since || Date.parse('2000-01-01 01:00:00');

      if (sinceTimestamp.length != 13) {
        if (sinceTimestamp.length == 10) {
          sinceTimestamp = sinceTimestamp + '000';
        } else {
          return res.send(new errors.BadRequest("timestamp is wrong"));
        }
      }
      sinceTimestamp = parseInt(sinceTimestamp);
      var sinceDate = new Date(sinceTimestamp);
      var sinceStr = __.getSqlDate(sinceDate);

      var num = req.params.num || null;
      SavedSearch.changelog(req.params.id, sinceStr, num).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/users/:id/saved-searches',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' }
      }
    }, ensureAuthenticated, function (req, res, next) {
/*
      if(req.params.authenticatedId !== parseInt(req.params.id)){
        return res.send(new errors.UnauthorizedRequest());
      }
      */

      var SavedSearch = new handlers[req.params.ver]['saved-search']();
      SavedSearch.getByUserId(req.params.id).then(function (result) {
        res.send(generateResponse(result));
      }).catch(function (err) {
        return res.send(new errors.BadRequest(err.message));
      });
    }
  );

  server.del(
    {
      url: '/:ver/users/:user_id/saved-searches/:saved_search_id',
      validation: {
        user_id: { isRequired: true, isInt: true, scope: 'path' },
        saved_search_id: { isRequired: true, isInt: true, scope: 'path' }
      }
    }, ensureAuthenticated, function (req, res, next) {
/*
      if(req.params.authenticatedId !== parseInt(req.params.user_id)){
        return res.send(new errors.UnauthorizedRequest());
      }
*/
      var SavedSearch = new handlers[req.params.ver]['saved-search']();
      SavedSearch.delete(req.params.saved_search_id, req.params.user_id).then(function (result) {
        res.send(generateResponse(result));
      }).catch(function (err) {
        return res.send(new errors.BadRequest(err.message));
      });
    }
  );

  server.get(
      {
        url: '/:ver/saved-searches/:id',
        validation: {
          id: { isRequired: true, isInt: true, scope: 'path' }
        }
      }, function (req, res, next) {
        var SavedSearch = new handlers[req.params.ver]['saved-search']();
        SavedSearch.getById(req.params.id).then(function (result) {
          res.send(generateResponse(result));
        });
      }
  );

  server.post(
      {
        url: '/:ver/saved-searches'
      }, function (req, res, next) {
        var data = (typeof req.body == 'string') ? JSON.parse(req.body) : req.body;
        var SavedSearch = new handlers[req.params.ver]['saved-search']();
        SavedSearch.create(data).then(function (result) {
          res.send(generateResponse(result));
        });
      }
  );

  server.get(
    {
      name: 'home',
      path: '/:ver'
    }, function (req, res, next) {
      res.send('Hello. This is the message coming from NodeJS.');
    });


  server.get(
    {
      url: '/:ver/properties/:key',
      validation: {
        key: { isRequired: true, scope: 'path' },
        type: { isRequired: false, isIn : ['mls', 'id'], scope: 'query' }
      }
    }, ensureAuthenticated, function (req, res, next) {

      var Property = new handlers[req.params.ver].property();
      var response = Property.getById(req.params);
      if (_.functions(response).indexOf('then') > -1) {
        response.then(function (result) {
          res.send(generateResponse(result));
        });
      } else {
        res.send(generateResponse(response));
      }
    }
  );

  server.get(
      {
        url: '/:ver/exclusive-properties/:key',
        validation: {
          key: { isRequired: true, scope: 'path' }
        }
      }, function (req, res, next) {

        var ExclusiveProperty = new handlers[req.params.ver]['exclusive-property']();
        var response = ExclusiveProperty.getById(req.params);
        if (_.functions(response).indexOf('then') > -1) {
          response.then(function (result) {
            res.send(generateResponse(result));
          });
        } else {
          res.send(generateResponse(response));
        }
      }
  );

  server.get(
      {
        url: '/:ver/exclusive-properties',
        validation: {
          /* validate if necessary */
        }
      }, function (req, res, next) {

        var ExclusiveProperty = new handlers[req.params.ver]['exclusive-property']();

        if (
            !(req.params.hasOwnProperty('response') &&
            ['markers', 'summary', 'full', 'autocomplete'].indexOf(req.params.response) > -1)
        ) {
          req.params.response = 'summary';
        }

        var promise;
        switch (req.params.response) {
          case 'markers':
            /* markers call */
            break;
          case 'summary':
          case 'full':
            promise = ExclusiveProperty.getSummary(req.params);
            break;
          case 'autocomplete':
            /* autocomplete call */
            break;
        }

        promise.then(function (result) {
          var Response = new response(result);
          var format = req.params.format || 'compact';
          if (format == 'compact') {
            Response.compact();
          }
          res.send(Response.generate());
        });
      }
  );

  server.get(
      {
        url: '/:ver/exclusive-properties/:key/similar',
        validation: {
          key: { isRequired: true, isInt: true, scope: 'path' },
          num: { isRequired: false, isInt: true, scope: 'query' }
        }
      }, ensureAuthenticated, function (req, res, next) {

        var ExclusiveProperty = new handlers[req.params.ver]['exclusive-property']();
        var response = ExclusiveProperty.getSimilar(req.params.key, req.params);
        if (_.functions(response).indexOf('then') > -1) {
          response.then(function (result) {
            res.send(generateResponse(result));
          });
        } else {
          res.send(generateResponse(response));
        }
      }
  );

  server.get(
    {
      url: '/:ver/properties',
      validation: {
        format: { isRequired: false, isIn: ['compact', 'standard'], scope: 'query' },
        zoom_level: { isRequired: false, isInt: true, scope: 'query' },
        is_complete: { isRequired: false, isInt: true, isIn: [1,0], scope: 'query' },
        assets_exact: { isRequired: false, isInt: true, isIn: [1,0], scope: 'query' },
        is_syndicated: { isRequired: false, isInt: true, isIn: [1,0], scope: 'query' }

        /*
         bounds: {
         isRequired: false,
         regex: /^(\-)?\d+(\.\d+)?(,|%2C)(\-)?\d+(\.\d+)?(,|%2C)(\-)?\d+(\.\d+)?(,|%2C)(\-)?\d+(\.\d+)?$/,
         scope: 'query'
         }
         */
      }
    }, ensureAuthenticated, function (req, res, next) {

      var Property = new handlers[req.params.ver].property();

      if (
        !(req.params.hasOwnProperty('response') &&
          ['markers', 'simple', 'summary', 'listview', 'full', 'autocomplete', 'count'].indexOf(req.params.response) > -1)
        ) {
        req.params.response = 'markers';
      }

      var promise;
      switch (req.params.response) {
        case 'simple':
          promise = Property.getSimple(req.params);
          break;
        case 'markers':
          promise = Property.getMarkers(req.params);
          break;
        case 'summary':
        case 'full':
          promise = Property.getSummary(req.params);
          break;
        case 'listview':
          promise = Property.getListview(req.params);
          break;
        case 'autocomplete':
          promise = Property.getAutocomplete(req.params);
          break;
        case 'count':
          promise = Property.getCount(req.params);
          break;
      }
      promise.then(function (result) {
        var Response = new response(result);
        var format = req.params.format || 'compact';
        if (format == 'compact') {
          Response.compact();
        }
        res.send(Response.generate());
      });
    }
  );

  server.put(
    {
      url: '/:ver/properties/:id',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' }
      }
    }, function (req, res, next) {
      var data = (typeof req.body == 'string') ? JSON.parse(req.body) : req.body;
      var Property = new handlers[req.params.ver].property();
      Property.updateProperty(parseInt(req.params.id), data).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/types/:name',
      validation: {
        name: { isRequired: true, scope: 'path' }
      }
    }, function (req, res, next) {
      var PropertyTrpType = new handlers[req.params.ver]['property-trp-type']();
      PropertyTrpType.getByName(req.params).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/types'
    }, function (req, res, next) {
      var PTT = new handlers[req.params.ver]['property-trp-type']();
      PTT.getAll().then(function (result) {
        res.send(generateResponse(result));
      });

    }
  );

  server.get(
    {
      url: '/:ver/projects',
      validation: {
        format: { isRequired: false, isIn: ['compact', 'standard'], scope: 'query' },
        zoom_level: { isRequired: false, isInt: true, scope: 'query' },
        is_exact: { isRequired: false, isInt: true, isIn: [1, 0], scope: 'query' },
        assets_exact: { isRequired: false, isInt: true, isIn: [1, 0], scope: 'query' }
      }
    }, ensureAuthenticated, function (req, res, next) {
      var Project = new handlers[req.params.ver].project();
      var responseTypeAr = ['markers', 'simple', 'summary', 'full', 'listview', 'autocomplete', 'count'];
      if (!(req.params.hasOwnProperty('response') && responseTypeAr.indexOf(req.params.response) > -1)) {
        req.params.response = 'markers';
      }

      var promise;
      switch (req.params.response) {
        case 'simple':
          promise = Project.getSimple(req.params);
          break;
        case 'markers':
          promise = Project.getMarkers(req.params);
          break;
        case 'summary':
        case 'full':
          promise = Project.getSummary(req.params);
          break;
        case 'listview':
          promise = Project.getListview(req.params);
          break;
        case 'autocomplete':
          promise = Project.getAutocomplete(req.params);
          break;
        case 'count':
          promise = Project.getCount(req.params);
          break;
      }

      promise.then(function (result) {
        var Response = new response(result);
        var format = req.params.format || 'compact';
        if (format == 'compact') {
          Response.compact();
        }
        res.send(Response.generate());
      });

    }
  );

  server.get(
    {
      url: '/:ver/projects/:key',
      validation: {
        key: { isRequired: true, scope: 'path' },
        type: {isRequired: false, isIn: ['name', 'id'], scope:'query'}
      }
    }, ensureAuthenticated, function (req, res, next) {
      var Project = new handlers[req.params.ver].project();
      var response = Project.getById(req.params.key, req.params);
      if (_.functions(response).indexOf('then') > -1) {
        response.then(function (result) {
          res.send(generateResponse(result));
        });
      } else {
        res.send(generateResponse(response));
      }
    }
  );

  server.get(
    {
      url: '/:ver/projects/:id/scores',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' }
      }
    }, function (req, res, next) {
      var Project = new handlers[req.params.ver].project();
      Project.getScores(req.params.id).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/pages',
      validation: {
        format: { isRequired: false, isIn: ['compact', 'standard'], scope: 'query' }
      }
    }, function (req, res, next) {
      var Page = new handlers[req.params.ver].page();
      try {
        return Page.search(req.params).then(function(result) {
          res.send(generateResponse(result));
        });
      } catch (err) {
        return next(new errors.BadRequest(err));
      }
    }
  );

  server.get(
    {
      url: '/:ver/project-amenities/:id',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' }
      }
    }, function (req, res, next) {
      var Amenity = new handlers[req.params.ver]['project-amenity']();
      Amenity.getById(req.params).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/units/:id',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' }
      }
    }, function (req, res, next) {
      var Unit = new handlers[req.params.ver].unit();
      Unit.getById(req.params).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/units',
      validation: {
        format: { isRequired: false, isIn: ['compact', 'standard'], scope: 'query' },
        zoom_level: { isRequired: false, isInt: true, scope: 'query' }
      }
    }, function (req, res, next) {
      var Unit = new handlers[req.params.ver].unit();
      var responseTypeAr = ['markers', 'simple', 'summary', 'full'];
      if (!(req.params.hasOwnProperty('response') && responseTypeAr.indexOf(req.params.response) > -1)) {
        req.params.response = 'markers';
      }

      var promise;
      switch (req.params.response) {
        case 'simple':
          promise = Unit.getSimple(req.params);
          break;
        case 'markers':
          promise = Unit.getMarkers(req.params);
          break;
        case 'summary':
        case 'full':
          promise = Unit.getSummary(req.params);
          break;
      }

      promise.then(function (result) {
        var Response = new response(result);
        var format = req.params.format || 'compact';
        if (format == 'compact') {
          Response.compact();
        }
        res.send(Response.generate());
      });

    }
  );

  server.get(
    {
      url: '/:ver/projects/:id/nearby',
      validation: {
        id: { isRequired: true, isInt: true },
        num: { isRequired: false, isInt: true }
      }
    }, ensureAuthenticated, function (req, res, next) {
      var Project = new handlers[req.params.ver].project();
      Project.getNearby(req.params.id, req.params).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/properties/:id/similar',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' },
        num: { isRequired: false, isInt: true, scope: 'query' }
      }
    }, ensureAuthenticated, function (req, res, next) {
      var Property = new handlers[req.params.ver].property();
      Property.getSimilar(req.params.id, req.params).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/properties/:id/landmarks',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' },
        num: { isRequired: false, isInt: true, scope: 'query' },
        types: { isRequired: false, scope: 'query' }
      }
    }, function (req, res, next) {
      var Property = new handlers[req.params.ver].property();
      Property.getLandmarks(req.params.id, req.params.types, req.params.num).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/properties/:id/scores',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' }
      }
    }, function (req, res, next) {
      var Property = new handlers[req.params.ver].property();
      Property.getScores(req.params.id).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/landmarks',
      validation: {
        bounds: { isRequired: true, isInt: false, scope: 'query' },
        num: { isRequired: false, isInt: true, scope: 'query' },
        types: { isRequired: false, scope: 'query' }
      }
    }, function (req, res, next) {
      var Landmark = new handlers[req.params.ver].landmark();
      Landmark.getNearbyByBounds(req.params.bounds, req.params.num, req.params.types).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/walkscores',
      validation: {
        addr: { isRequired: false, scope: 'query' },
        city: { isRequired: false, scope: 'query' },
        lat: { isRequired: true, scope: 'query' },
        lng: { isRequired: true, scope: 'query' },
        type: { isRequired: false, isIn: ['walk', 'transit'], score: 'query'}
      }
    }, function (req, res, next) {
      if (!(req.params.hasOwnProperty('type') && ['walk', 'transit'].indexOf(req.params.type) > -1)) {
        req.params.type = 'walk';
      }
      var Walkscore = new handlers[req.params.ver].walkscore();

      var promise;
      switch (req.params.type) {
        case 'walk':
          promise = Walkscore.getWalkScore(req.params.addr, req.params.lat, req.params.lng);
          break;
        case 'transit':
          promise = Walkscore.getTransitScore(req.params.city, req.params.lat, req.params.lng);
          break;
      }

      promise.then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/hoods/:key',
      validation: {
        key: {isRequired: true, scope: 'path'},
        scope: {isRequired: false, scope: 'query'},
        options: {isRequired: false, scope: 'query'}
      }
    }, function (req, res, next) {
      var Hoods = new handlers[req.params.ver].hood();
      Hoods.getById(req.params.key, req.params.scope, req.params.options).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/cities',
      validation: {
        bounds: {
          isRequired: false,
          //regex: /^(\-)?\d+(\.\d+)?(,|%2C)(\-)?\d+(\.\d+)?(,|%2C)(\-)?\d+(\.\d+)?(,|%2C)(\-)?\d+(\.\d+)?$/,
          regex: /((\-)?\d+(\.\d+)?)+/,
          scope: 'query'
        },
        is_exact: {isRequired:false, isBoolean:true, scope: 'query'},
        featured: {isRequired: false, isBoolean: true, scope: 'query'},
        province: {isRequired: false, isString: true, scope: 'query'}
      }
    }, function (req, res, next) {
      var city = new handlers[req.params.ver].city();
      var promise;
      if (req.params.hasOwnProperty('bounds')) {
        promise = city.getByBounds(req.params.bounds, req.params.exact);
      } else if (req.params.hasOwnProperty('featured')) {
        promise = city.getFeaturedCities();
      } else {
        promise = city.getAll(req.params.province);
      }

      promise.then(function (result) {
        var extraPromises = [];
        if (req.params.hasOwnProperty('count')) {
          var countPromise;
          var areaIds = result.map(function (row) {
            return row.id;
          });

          var filters = _.omit(req.params, 'bounds', 'count', 'num', 'page');
          switch (req.params.count) {
            case 'properties':
              countPromise = city.getPropertiesCount(areaIds, filters);
              break;
            case 'projects':
              countPromise = city.getProjectsCount(areaIds, filters);
              break;
            case 'units':
              countPromise = city.getUnitsCount(areaIds, filters);
              break;
          }

          extraPromises.push(when(countPromise).then(function (countResult) {
            var Geometry = require(PATH + '/lib/geometry');
            result.forEach(function (city) {
              var countObj = _.findWhere(countResult, {id: city.id}) || {id: city.id, count: 0};
              city.dataValues.count = countObj.count;
              var polygon = new Geometry.Polygon(city.bounds, 'polygon');
              var centroid = polygon.centroid();
              city.dataValues.lat = centroid.lat;
              city.dataValues.lng = centroid.lng;
            });
          })
          );
        }

        when.all(extraPromises).then(function () {
          var Response = new response(result);
          var format = req.params.format || 'compact';
          if (format == 'compact') {
            Response.compact();
          }

          res.send(Response.generate());
        });
      });
    }
  );

  server.get(
    {
      url: '/:ver/hoods',
      validation: {
        bounds: {
          isRequired: false,
          regex: /((\-)?\d+(\.\d+)?)+/,
          scope: 'query'
        },
        exact: {isRequired:false, isBoolean:true, scope: 'query'},
        featured: {isRequired: false, isBoolean: true, scope: 'query'}
      }
    }, function (req, res, next) {
      var hood = new handlers[req.params.ver].hood();
      var promise;
      if (req.params.hasOwnProperty('bounds')) {
        promise = hood.getByBounds(req.params.bounds, req.params.exact);
      } else if (req.params.hasOwnProperty('featured')) {
        promise = hood.getFeaturedHoods();
      } else {
        promise = hood.getAll();
      }

      promise.then(function (result) {
        var extraPromises = [];
        if (req.params.hasOwnProperty('count')) {
          var countPromise;
          var areaIds = result.map(function (row) {
            return row.id;
          });

          var filters = _.omit(req.params, 'bounds', 'count', 'num', 'page');
          switch (req.params.count) {
            case 'properties':
              countPromise = hood.getPropertiesCount(areaIds, filters);
              break;
            case 'projects':
              countPromise = hood.getProjectsCount(areaIds, filters);
              break;
            case 'units':
              countPromise = hood.getUnitsCount(areaIds, filters);
              break;
          }

          extraPromises.push(when(countPromise).then(function (countResult) {
              result.forEach(function (hood) {
                var countObj = _.findWhere(countResult, {id: hood.id}) || {id: hood.id, count: 0};
                hood.dataValues.count = countObj.count;
                var polygon = new Geometry.Polygon(hood.bounds, 'polygon');
                var centroid = polygon.centroid();
                hood.dataValues.lat = centroid.lat;
                hood.dataValues.lng = centroid.lng;
              });
            })
          );
        }

        when.all(extraPromises).then(function () {
          var Response = new response(result);
          var format = req.params.format || 'compact';
          if (format == 'compact') {
            Response.compact();
          }
          res.send(Response.generate());
        });
      });
    }
  );

  server.get(
    {
      url: '/:ver/cities/:id',
      validation: {
        id: {isRequired: true, scope: 'path'},
        scope: {isRequired: false, scope: 'query'},
        options: {isRequired: false, scope: 'query'}
      }
    }, function (req, res, next) {
      var Cities = new handlers[req.params.ver].city();
      Cities.getById(req.params.id, req.params.scope, req.params.options).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
      {
        url: '/:ver/cities',
      }, function (req, res, next) {
        var Cities = new handlers[req.params.ver].city();
        Cities.getAll().then(function (result) {
          res.send(generateResponse(result));
        });
      }
  );

  server.get(
    {
      url: '/:ver/locations/',
      validation: {
        options: {isRequired: true, scope: 'query'}
      }
    }, function (req, res, next) {
      var Location = new handlers[req.params.ver].location();
      Location.getByPoint(req.params.options).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/locations/:key',
      validation: {
        key: {isRequired: true, scope: 'path'},
      }
    }, function (req, res, next) {
      var Location = new handlers[req.params.ver].location();
      Location.getByKey(req.params.key).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/cities/:id/hoods',
      validation: {
        id: {isRequired: true, isInt: true, scope: 'path'},
        featured: {isRequired: true, isBoolean: true, scope: 'query'}
      }
    }, function (req, res, next) {
      var Cities = new handlers[req.params.ver].city();
      Cities.getHoods(req.params.id, req.params.featured).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/provinces/:id',
      validation: {
        id: {isRequired: true, scope: 'path'},
        options: {isRequired: false, scope: 'query'}
      }
    }, function (req, res, next) {
      var Provinces = new handlers[req.params.ver].province();
      Provinces.getById(req.params.id, null, req.params.options).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/provinces',
      validation: {
        format: { isRequired: false, isIn: ['compact', 'standard'], scope: 'query' }
      }
    }, function (req, res, next) {
      var Province = new handlers[req.params.ver].province();
      if (!(req.params.hasOwnProperty('response') && ['simple', 'count'].indexOf(req.params.response) > -1)) {
        req.params.response = 'simple';
      }

      var promise;
      switch (req.params.response) {
        case 'simple':
          promise = Province.getSimple(req.params);
          break;
        case 'count':
          promise = Province.getCount(req.params);
          break;
      }

      promise.then(function (result) {
        var Response = new response(result);
        var format = req.params.format || 'compact';
        if (format == 'compact') {
          Response.compact();
        }
        res.send(Response.generate());
      });

    }
  );

server.get(
    {
      url: '/:ver/builders',
      validation: {
        format: { isRequired: false, isIn: ['compact', 'standard'], scope: 'query' }
      }
    }, function (req, res, next) {
      var Builder = new handlers[req.params.ver].builder();
      if (!(req.params.hasOwnProperty('response')
            && ['simple', 'count', 'autocomplete'].indexOf(req.params.response) > -1)) {
        req.params.response = 'simple';
      }

      var promise;
      switch (req.params.response) {
        case 'simple':
          promise = Builder.getSimple(req.params);
          break;
        case 'count':
          promise = Builder.getCount(req.params);
          break;
        case 'autocomplete':
          promise = Builder.getAutocomplete(req.params);
          break;
      }

      promise.then(function (result) {
        var Response = new response(result);
        var format = req.params.format || 'compact';
        if (format == 'compact') {
          Response.compact();
        }
        res.send(Response.generate());
      });

    }
  );

  server.get(
    {
      url: '/:ver/builders/:id',
      validation: {
        id: {isRequired: true, scope: 'path'}
      }
    }, function (req, res, next) {
      var Builders = new handlers[req.params.ver].builder();
      if (isNaN(req.params.id)) {
        // not number --> webid
        Builders.getByWebId(req.params.id).then(function (result) {
          res.send(generateResponse(result));
        });
      } else {
        Builders.getById(req.params.id).then(function (result) {
          res.send(generateResponse(result));
        });
      }
    }
  );

  server.get(
    {
      url: '/:ver/regions',
      validation: {
        bounds: {
          isRequired: false,
          regex: /^(\-)?\d+(\.\d+)?(,|%2C)(\-)?\d+(\.\d+)?(,|%2C)(\-)?\d+(\.\d+)?(,|%2C)(\-)?\d+(\.\d+)?$/,
          scope: 'query'
        },
        featured: {isRequired: false, isBoolean: true, scope: 'query'}
      }
    }, function (req, res, next) {
      var region = new handlers[req.params.ver].region();
      var promise;
      if (req.params.hasOwnProperty('bounds')) {
        promise = region.getByBounds(req.params.bounds);
      } else if (req.params.hasOwnProperty('featured')) {
        promise = region.getFeaturedHoods();
      } else {
        promise = region.getAll();
      }

      promise.then(function (result) {
        var extraPromises = [];
        if (req.params.hasOwnProperty('count')) {
          var countPromise;
          var areaIds = result.map(function (row) {
            return row.id;
          });

          var filters = _.omit(req.params, 'bounds', 'count', 'num', 'page');
          switch (req.params.count) {
            case 'properties':
              countPromise = region.getPropertiesCount(areaIds, filters);
              break;
            case 'projects':
              countPromise = region.getProjectsCount(areaIds, filters);
              break;
            case 'units':
              countPromise = region.getUnitsCount(areaIds, filters);
              break;
          }

          extraPromises.push(when(countPromise).then(function (countResult) {
            result.forEach(function (region) {
              var countObj = _.findWhere(countResult, {id: region.id}) || {id: region.id, count: 0};
              region.dataValues.count = countObj.count;
              var polygon = new Geometry.Polygon(region.bounds, 'polygon');
              var centroid = polygon.centroid();
              region.dataValues.lat = centroid.lat;
              region.dataValues.lng = centroid.lng;
            });
          })
          );
        }

        when.all(extraPromises).then(function () {
          var Response = new response(result);
          var format = req.params.format || 'compact';
          if (format == 'compact') {
            Response.compact();
          }
          res.send(Response.generate());
        });
      });
    }
  );

  server.get(
    {
      url: '/:ver/regions/:key',
      validation: {
        key: { isRequired: true, scope: 'path' },
        options: {isRequired: false, scope: 'query'}
      }
    }, function (req, res, next) {

      var Region = new handlers[req.params.ver].region();
      Region.getById(req.params.key, null, req.params.options).then(function (response){
        res.send(generateResponse(response));
      });
    }
  );

  server.get(
    {
      url: '/:ver/provinces/:id/cities',
      validation: {
        id: {isRequired: true, isInt: true, scope: 'path'},
        featured: {isRequired: true, isBoolean: true, scope: 'query'}
      }
    }, function (req, res, next) {
      var Provinces = new handlers[req.params.ver].province();
      Provinces.getCities(req.params.id, req.params.featured).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.post(
    {
      url: '/:ver/contacts'
    }, function (req, res, next) {

      var data = (typeof req.body == 'string') ? JSON.parse(req.body) : req.body;
      var Contact = new handlers[req.params.ver].contact();
      Contact.add(data).then(function (result) {
        res.send(generateResponse(result));
      });


    }
  );

  server.post(
    {
      url: '/:ver/resources'
    }, function (req, res, next) {
      var Resource = new handlers[req.params.ver].resource();
      Resource.createResources(JSON.parse(req.body)).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.del(
    {
      url: '/:ver/resources/:id',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' }
      }
    }, function (req, res, next) {
      var Resource = new handlers[req.params.ver].resource();
      Resource.deleteResource(req.params.id).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
      {
        url: '/:ver/resources-temp',
        validation: {
          entity_id: {isRequired: true, isInt: true, scope: 'query'},
          entity_type: {isRequired: true, scope: 'query'},
          num: {isRequired: false, isInt: true, score: 'query'}
        }
      }, function (req, res, next) {
        var Resource = new handlers[req.params.ver]['resource-temp']();
        Resource.getResources(req.params).then(function (result) {
          res.send(generateResponse(result));
        });
      }
  );

  server.post(
    {
      url: '/:ver/resources-temp'
    }, function (req, res, next) {
      var Resource = new handlers[req.params.ver]['resource-temp']();
      Resource.createResources(JSON.parse(req.body)).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.del(
    {
      url: '/:ver/resources-temp/:id',
      validation: {
        id: { isRequired: true, isInt: true, scope: 'path' }
      }
    }, function (req, res, next) {
      var Resource = new handlers[req.params.ver]['resource-temp']();
      Resource.deleteResource(req.params.id).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/user/add'
    }, function (req, res, next) {
      var User = new handlers[req.params.ver].user();
      User.add().then(function (result) {
        res.send('ok');
      });
    }
  );

  server.get(
    {
      url: '/:ver/rates',
      validation: {
        type: { isRequired: false, isIn: ['interestRate', 'listingRebateCoefficient'], scope: 'query' }
      }
    }, function (req, res, next) {
      var Rate = new handlers[req.params.ver].rate();
      Rate.getRateByType(req.params.type).then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.get(
    {
      url: '/:ver/trp1cities/:id',
      validation: {
        id: {isRequired: true, scope: 'path'},
        scope: {isRequired: false, scope: 'query'}
      }
    }, function (req, res, next) {
      var Trp1Cities = new handlers[req.params.ver].trp1city();
      if (isNaN(req.params.id)) {
        // not number --> webid
        Trp1Cities.getByWebId(req.params.id, req.params.scope).then(function (result) {
          res.send(generateResponse(result));
        });
      } else {
        res.send('Not implemented');
      }
    }
  );

  server.get(
    {
      url: '/:ver/trp1hoods/:id',
      validation: {
        id: {isRequired: true, scope: 'path'},
        scope: {isRequired: false, scope: 'query'}
      }
    }, function (req, res, next) {
      var Trp1Hoods = new handlers[req.params.ver].trp1hood();
      if (isNaN(req.params.id)) {
        // not number --> webid
        Trp1Hoods.getByWebId(req.params.id, req.params.scope).then(function (result) {
          res.send(generateResponse(result));
        });
      } else {
        res.send('Not implemented');
      }
    }
  );

  server.get(
      {
        url: '/:ver/redirects/:url',
        validation: {
          url: {isRequired: true, scope: 'path'}
        }
      }, function (req, res, next) {
        var UrlForward = new handlers[req.params.ver]['url-forward']();
        // not number --> webid
        UrlForward.getByOrigUrl(req.params.url).then(function (result) {
          res.send(generateResponse(result));
        });
      }
  );

  server.get(
    {
      url: '/:ver/searches',
      validation: {
        num: {isRequired: false, isInt: true, scope: 'query'},
        order_by: {isRequired: false, scope: 'query'},
        response: {isRequired: false, isIn: ['oldest'], scope: 'query'}
      }
    }, function (req, res, next) {
      if (!(req.params.hasOwnProperty('response')
        && ['oldest'].indexOf(req.params.response) > -1)) {
        req.params.response = 'oldest';
      }
      var SavedSearch = new handlers[req.params.ver]['saved-search']();
      var promise;
      switch (req.params.response) {
        case 'oldest':
          promise = SavedSearch.getOne(req.params.order_by);
          break;
      }

      promise.then(function (result) {
        res.send(generateResponse(result));
      });
    }
  );

  server.put(
    {
      url: '/:ver/searches/:id',
      validation: {
        id: {isRequired: true, isInt: true, scope: 'path'}
      }
    }, function (req, res, next) {

      var SavedSearch = new handlers[req.params.ver]['saved-search']();

      var params =  _.omit(req.params, 'ver', 'id');

      SavedSearch.update(req.params.id, params).then(function(result){
        res.send(generateResponse(result));
      });

    }
  );

  server.get(
    {
      url: '/:ver/events',
      validation: {
        num: {isRequired: false, isInt: true, scope: 'query'},
        status: {isRequired: false, isIn: ['new', 'pushed', 'failed', 'delayed', 'processing'], scope: 'query'},
        order_by: {isRequired: false, scope: 'query'},
        max_attempts: {isRequired: false, isInt: true, scope: 'query'},
        response: {isRequired: false, isIn: ['list', 'process'], scope: 'query'}
      }
    }, function (req, res, next) {
      var response = req.params.response || 'list';
      var promise;

      var Events = new handlers[req.params.ver].event();
      switch (response) {
        case 'list':
          promise = Events.get(req.params);
          break;
        case 'process':
          // locks and update row status to processing
          promise = Events.getOne(req.params);
          break;
      }

      return when(promise).then(function (promise) {
        if (Object.keys(promise).length > 0) {
          res.send(generateResponse(promise));
        } else {
          res.send(204, generateResponse(promise));
        }
      });

    }
  );

  server.post(
    {
      url: '/:ver/events',
      validation: {
        type: {isRequired: true, isIn: ['forgot-password'], scope: 'query'}
      }
    }, function (req, res, next) {

      var Events = new handlers[req.params.ver].event();
      Events.create(req.body, req.params.type).then(function (result) {
        res.send(generateResponse(result));
      });

    }
  );

  server.put(
    {
      url: '/:ver/events/:id',
      validation: {
        id: {isRequired: true, isInt: true, scope: 'path'},
        status: {isRequired: true, isIn: ['new', 'pushed', 'failed', 'delayed', 'processing'], scope: 'body'}
      }
    }, function (req, res, next) {

      var Events = new handlers[req.params.ver].event();
      Events.update(req.params.id, req.body).then(function (result) {
        res.send(generateResponse(result));
      });

    }
  );

  server.post(
    {
      url: '/:ver/events/:id/logs',
      validation: {
        id : {isRequired: true, isInt: true, scope: 'path'}
      }
    }, function (req, res, next) {
      var Events = new handlers[req.params.ver].event();
      Events.createLog(req.params.id, req.body).then(function(result){
        res.send(generateResponse(result));
      })
    }
  );

  server.get(
    {
      url: '/:ver/agents',
      validation: {
        active: {isRequired: false, isIn: [0,1], scope: 'query'}
      }
    }, function (req, res, next) {

      var Agent = new handlers[req.params.ver].agent();
      Agent.getAll(req.params).then(function(result){
        res.send(generateResponse(result));
      });

    }
  );

  server.get(
    {
      url: '/:ver/agents/:key',
      validation: {
        key: {isRequired:true, scope: 'path'}
      }
    }, function (req, res, next) {

      var promise;
      var Agent = new handlers[req.params.ver].agent();

      if(__.isInt(req.params.key)){
        promise = Agent.getById(req.params.key);
      }else{
        promise = Agent.getByWebId(req.params.key)
      }

      promise.then(function(result){
        res.send(generateResponse(result));
      });

    }
  );

  server.get(
    {
      url: '/:ver/press',
      validation: {
        order_by: {isRequired: false, scope: 'query'}
      }
    }, function (req, res, next) {

      var Press = new handlers[req.params.ver].press();
      Press.getAll(req.params).then(function(result){
        res.send(generateResponse(result));
      }).catch(function (err) {
        return res.send(new errors.BadRequest(err.message));
      });
    }
  );

  server.get(
    {
      url: '/:ver/metros/',
      validation: {
        area: {isRequired: true, scope: 'query'}
      }
    }, function (req, res, next) {
      memcached.get(req.url, function (err, cachedResult) {
        if (err) {
          return res.send(500, new errors.InternalError(err.message));
        }
        if (typeof cachedResult === 'undefined') {
          var metro = new handlers[req.params.ver].metro();
          metro.getSummary(req.params).then(function (result) {
            memcached.set(req.url, generateResponse(result), function (err) {
              if (err) {
                return res.send(500, new errors.InternalError(err.message));
              }
              return res.send(generateResponse(result));
            });
          }).catch(function (err) {
            return res.send(new errors.BadRequest(err.message));
          });
        }else {
          return res.send(cachedResult);
        }
      });
    }
  );

  server.get(
    {
      url: '/:ver/statistics/properties/',
      validation: {
        stat: {isRequired: true, scope: 'query'}
      }
    }, function (req, res, next) {
      var stats = new handlers[req.params.ver].stats();
      switch(req.params.stat) {
        case 'historical-price':
          statMethod = 'getHistoricalAveragePrice';
          break;
        case 'price':
          statMethod = 'getAveragePrice';
          break;
        default:
          statMethod = 'getAveragePrice';
      };
      memcached.get(req.url, function (err, cachedResult) {
        if(err) {
          return res.send(500, new errors.InternalError(err.message));
        }

        if (typeof cachedResult === 'undefined') {
          stats[statMethod](req.params).then(function(result){
            memcached.set(req.url, generateResponse(result), function (err) {
              if (err) {
                return res.send(500, new errors.InternalError(err.message));
              }
              return res.send(generateResponse(result));
            });
          }).catch(function (err) {
            return res.send(new errors.BadRequest(err.message));
          });
        }else{
          return res.send(cachedResult);
        };
      });

    }
  );

};


function generateResponse (result) {
  return { code: 'ok', result: result };
}

function ensureAuthenticated (req, res, next) {

  passport.authenticate('bearer', { session: false }, function (err, user, info) {
    if (err) {
      res.send('loser!' + JSON.stringify(info));
    }

    if(req.params.backdoor == 1) {
      req.params.isAuthenticated = true;
      return next();
    }

    if (!user) {
      req.params.isAuthenticated = false;
      next();
//      res.send('no user' + JSON.stringify(info));
    } else {
      req.params.authenticatedId = user.id;
      req.params.isAuthenticated = true;
      next();
    }
  })(req, res, next);
}