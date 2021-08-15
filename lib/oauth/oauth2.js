/**
 * Created by jose on 2015-01-22.
 */
var oauth2orize = require('oauth2orize')
  , passport = require('passport')
  , crypto = require('crypto')
  , error = require(PATH + '/lib/errors')
  , when = require('when');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

// Generic error handler
var errFn = function (cb, err) {
  if (err) {
    return cb(err);
  }
};

// Destroys any old tokens and generates a new access and refresh token
var generateTokens = function (modelData, done) {

  var errorHandler = errFn.bind(undefined, done), // curries in `done` callback so we don't need to pass it
    refreshToken,
    refreshTokenValue,
    accessToken,
    tokenValue;

  if(modelData.access_token_id !== undefined){
    models.OauthRefreshToken.findById(modelData.refresh_token_id).then(function (token){
      if(token){
        token.destroy();
      }
    });
    models.OauthAccessToken.findById(modelData.access_token_id).then(function (token){
      if(token){
        token.destroy();
      }
    });
  }

  tokenValue = crypto.randomBytes(32).toString('base64');
  refreshTokenValue = crypto.randomBytes(32).toString('base64');

  modelData.token = tokenValue;
  accessToken = models.OauthAccessToken.build(modelData);

  var promise = [];
  var accessTokenId;

  promise['access'] = accessToken.save().then(function (res) {
    accessTokenId = res.id;
  }).catch(function (err){
    return done(err);
  });

  when(promise['access'], function(){
    modelData.token = refreshTokenValue;
    modelData.access_token_id = accessTokenId;
    refreshToken = models.OauthRefreshToken.build(modelData);

    promise['refresh'] = refreshToken.save().catch(function (err){
      return done(err);
    });
  });

  when.all(promise).then(function(){
    done(null, tokenValue, refreshTokenValue, {
      expires_in: tokenLife,
      user: {
        id: modelData.user_data.id,
        first_name: modelData.user_data.first_name,
        last_name: modelData.user_data.last_name,
        email: modelData.user_data.email,
        phone: modelData.user_data.phone
      }
    });
  });
};

// Exchange username & password for access token.
server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {
  models.User.find({
      where: { username: username, role_id: 3} //todo: find a way to make role_id dynamic;
    }).then(function (user) {

      if (!user || !user.checkPassword(password)) {
        return done(null, false);
      }

      models.Registry.find(
        {
          attributes: ['content'],
          where: {name: 'userSettings'}
        }).then(function (res) {
          var rules = JSON.parse(res.content);

          if (rules.requireValidation == 1 && user.user_status_id != 1) {
            done(new error.InactiveAccount('Inactive Account'));
          }

          var modelData = {user_id: user.id, oauth_client_id: client.client_id, user_data: user };

          generateTokens(modelData, done);

        });
    });
}));

// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {
  models.OauthRefreshToken.find({
    where:{
      token: refreshToken, oauth_client_id: client.client_id
    }
  }).then(function (token) {

    if (!token) {
      return done(null, false);
    }

    models.User.findById(token.user_id).then(function (user) {
      if (!user) {
        return done(null, false);
      }

      var modelData = {
        user_id: user.id,
        oauth_client_id: client.client_id,
        access_token_id: token.access_token_id,
        user_data: user
      };

      generateTokens(modelData, done);
    });
  });
}));

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

exports.token = [
  passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
  server.token(),
  server.errorHandler()
];
