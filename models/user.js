var environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , when = require('when')
  , crypto = require('crypto')
  ;

module.exports = function (sequelize) {

  var User = sequelize.import(PATH + '/models/base/user');
  _.extend(User.options.instanceMethods, {

    checkPassword: function (password) {
      return models.User.encriptPassword(password) === this.password;
    },
    validateForgotPasswordToken: function () {
      var now = Date.now();
      if(this.forgot_password_expires_on >= now){
        return true;
      }

      return false;

  },
    encriptPassword: function (password) {
      return models.User.encriptPassword(password);
    },
    addField: function (field, value) {
      this.dataValues[field] = value;
    },
    deleteField: function (field) {
      delete(this.dataValues[field]);
    },
    generateEvent: function (params, type){
      var eventParams = models.User.createEvent(params, type);
      this.dataValues.forgot_password_token = eventParams.forgot_password_token;
      this.dataValues.forgot_password_expires_on = eventParams.forgot_password_expires_on;
      return this;
    },
    addEventParams: function (params, type){
      var event;
      // set activation
      var activationUrl;
      var validationCode = models.User.compileValidationCode(this.validation_code, this.id);
      activationUrl = environment.clients.web.url+'/authenticate/?code='+validationCode+'#activating';

      switch(type){
        case 'vow-registration':
          // maketo_event_id added in the event handler.
          event = {
            ext_table: 'User',
            email: this.email,
            ext_id: this.id,
            ext_params: JSON.stringify({unencoded_password: params.password, activation_url: activationUrl}),
            track_marketo_cookie: params.track_marketo_cookie,
            track_ip: params.track_ip,
            track_browser: params.track_browser,
            track_browser_version: params.track_browser_version,
            track_os: params.track_os,
            track_os_version: params.track_os_version,
            track_landing_page: params.track_landing_url,
            track_http_referrer: params.track_http_referrer,
            track_page_url: params.track_page_url,
            track_channel: params.track_channel
          };
          break;
        case 'subscription':
          event = {
            ext_table: 'User',
            email: this.email,
            ext_id: this.id,
            track_marketo_cookie: params.track_marketo_cookie,
            track_ip: params.track_ip,
            track_browser: params.track_browser,
            track_browser_version: params.track_browser_version,
            track_os: params.track_os,
            track_os_version: params.track_os_version,
            track_landing_page: params.track_landing_url,
            track_http_referrer: params.track_http_referrer,
            track_page_url: params.track_page_url
          };
        default:
          break;
      }

      this.dataValues.event_params = event;

      return this;
    }
  });

  _.extend(User.options.classMethods, {
    encriptPassword: function (password) {
      return crypto.createHash('md5').update(password).digest('hex');
    },
    compileValidationCode: function (validationCode, id) {
      return validationCode.substring(0,10)+id+validationCode.substring(10);
    },
    createEvent: function (params, type){
      var event = {};
      switch(type){
        case 'forgot-password':
          var token = __.randomString(32);
          var expirationDate = new Date();
          var daysToAdd = 2;
          expirationDate.setDate(expirationDate.getDate() + daysToAdd);
          event = {
            forgot_password_token: token,
            forgot_password_expires_on: expirationDate
          };
          break;
        default:
          break;
      }

      return event;
    }
  });

  User.reinit();

  return User;

};