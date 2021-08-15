var passport = require('passport')
, BasicStrategy = require('passport-http').BasicStrategy
, ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
, BearerStrategy = require('passport-http-bearer').Strategy;

passport.use(new BasicStrategy(
  function (username, password, done) {

    models.OauthClient.find({ where: { client_id: username }}).then(function (result) {
      if (!result) {
        return done(null, false);
      }

      if (result.client_secret != password) {
        return done(null, false);
      }

      return done(null, result);
    });
  }
));

passport.use(new ClientPasswordStrategy(
  function (clientId, clientSecret, done) {
    models.OauthClient.find({
      where: { client_id: clientId }
    }).then(function (result) {
      if (!result) {
        return done(null, false);
      }

      if (result.client_secret != clientSecret) {
        return done(null, false);
      }

      return done(null, result);
    });
  }
));

passport.use(new BearerStrategy(
  function (accessToken, done) {

    models.OauthAccessToken.find({where: {token: accessToken}}).then(function (result){
      if (!result) {
        return done(null, false);
      }

      if (Math.round((Date.now() - result.created_on) / 1000) > tokenLife) {

        return models.OauthAccessToken.findById(result.id).then(function (token){
          return token.destroy().then(function(){
            return done(null, false, { message: 'Token expired' });
          });
        });

      }

      return models.User.findById(result.user_id).then(function (user) {
        if (!user) {
          return done(null, false, { message: 'Unknown user' });
        }

        var info = { scope: '*' };
        return done(null, user, info);
      });
    });
  }
));
