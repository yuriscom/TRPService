var environments = require(PATH + '/configuration/environments.json');
var environment = environments[ process.env.NODE_ENV || 'production' ];
var crypto = require('crypto');
var when = require('when');

function User () {
}

User.prototype.version = '1.0.0';

User.prototype.add = function (params) {
  //set expiration date
  var today = new Date();
  var expirationDate = new Date(today);
  expirationDate.setDate(today.getDate()+90);
  //generate validation code
  var validationCode = __.randomString(20);
  //get registry setting for activation logic
  var isUserValidationOn = models.Registry.findOne({where: {name:'userSettings'}}).then(function (registry) {
      return JSON.parse(registry.content);
  });

  //determine user status: Pending activation (3) or active (1)
  var isUserValidated = (params.valid) ? params.valid : 1;
  var userStatusId = (isUserValidationOn && !isUserValidated) ? 3 : 1;
  //set role_id
  var userRoleId = (params.role_id) ? params.role_id : 3; // 3 = Public User
  var fullnameAr = params.full_name.split(' ');

  var userParams = {
    first_name: fullnameAr[0],
    last_name: (fullnameAr[1]) ? fullnameAr[1] : 'Unspecified',
    password: crypto.createHash('md5').update(params.password).digest('hex'),
    role_id: userRoleId,
    phone: (params.phone) ? params.phone : null,
    pref_move_timeframe: params.pref_move_timeframe,
    user_status_id: userStatusId,
    validation_code: validationCode,
    expires_on: expirationDate,
    created_on: today
  };
  var self = this;
  return this.doesEmailExist(params.email, [1, 3], true).then(function (existingUsers) {

    if(existingUsers.length > 0){
      var returnObj;
      for(var i = 0; i <= existingUsers.length; i++){

        // Check if any of the users returned are role_id 3 or same as params.role_id if passed
        if((existingUsers[i].role_id == 3 || existingUsers[i].role_id == userRoleId) && userRoleId != 1){
          return 'User already exists';
        }else{
          _.each(userParams, function (value, key){
            existingUsers[i][key] = value;
          });
          existingUsers[i]['role_id'] = 3;
          return existingUsers[i].save().then(function (user) {
            user.addEventParams(params, 'vow-registration');
            var Events = new handlers[self.version].event();
            Events.create(user.dataValues.event_params, 'vow-registration');
            user.deleteField('event_params');
            return returnObj = user;
          });
        }
      }
    }else{
      if(_.isEmpty(params.login_type_id) || typeof params.login_type_id === 'undefined'){
        userParams.login_type_id = 1;
      }
      userParams.role_id = (params.role_id) ? params.role_id : 3;
      userParams.phone = (params.phone) ? params.phone : null;
      userParams.email = params.email;
      userParams.username = (params.username) ? params.username : params.email;
      userParams.affiliate_id = (params.affiliate_id) ? params.affiliate_id : 0;

      //save and generate events
      return models.User.build(userParams).save().then(function (user) {
        user.addEventParams(params, 'vow-registration');
        var Subscriptions = new handlers[self.version].subscription();
        Subscriptions.addAll(user.id, params['subscription_source']);
        var Events = new handlers[self.version].event();
        Events.create(user.dataValues.event_params, 'vow-registration');
        user.deleteField('event_params');
        return user;
      }).catch(function (err) {
        return err;
      });
    }
  });
};

User.prototype.doesEmailExist = function (email, role, returnObj) {

  if(typeof returnObj === 'undefined'){
    returnObj = false;
  }
  if(role === null || typeof role === 'undefined'){
    role = 3;
  }
  return models.User.findAll(
    {
      where: Sequelize.and(
        { role_id: role },
        { username: email }
      )

    }).then(function (user) {
        
        if(user.length > 0){
          if(returnObj === true){
            return user;
          }else{
            return true;
          }
        }else{
          return false;
        }
    });
};

User.prototype.getByEmail = function (email, role) {

  if(role === null || typeof role === 'undefined'){
    role = 3;
  }
  return models.User.find(
    {
      where: Sequelize.and(
        { role_id: role },
        Sequelize.or(
          { username: email },
          { email: email }
        )
      )

    }).then(function (user) {
      return user;
    });
};

User.prototype.getByToken = function (token, role) {

  return models.User.find(
    {
      where: {
        role_id: role,
        forgot_password_token: token
      }
    }).then(function (user) {

      if(!user){
        return false;
      }

      var isTokenValid = user.validateForgotPasswordToken();
      if(isTokenValid){
        return user;
      }

      return false;
    });
};

User.prototype.validate = function (params) {
  return rp.post('http://' + environment.externalResources.trp.url + '/service/account/activateuser')
    .form({data: JSON.stringify(params)})
    .then(function (res) {

      var response = JSON.parse(res);
      return response;

    }).catch(function (err) {
      return err;
    });
};

User.prototype.update = function (key, params, isPassword) {

  var where;
  var isForgotPassword = false;

  if(__.isInt(key)){
    where = {id: key}
  }
  if(key.length == 32){
    where = {forgot_password_token: key};
    isForgotPassword = true;
  }else{
    where = {email: key};
  }

  return  models.User.find({where: where}).then(function (user){
    if(isPassword === true){
      if(user.checkPassword(params['password'])){
        user.password = user.encriptPassword(params['new_password']);
        return user.save();
      }else{
        return 'Invalid password';
      }
    }else if(isForgotPassword){
      user.forgot_password_token = null;
      user.forgot_password_expires_on = null;
      user.password = user.encriptPassword(params['password']);
    }else{
      _.each(params, function(param, key){
        user[key] = param;
      });
    }
    return user.save();
  }).catch(function(err){
    return err;
  });
};

exports = module.exports = User;
