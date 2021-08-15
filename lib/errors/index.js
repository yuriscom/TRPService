var util = require('util')
  , restify = require('restify')
  ;

function InternalError (message) {
  restify.RestError.call(this, {
    restCode: '500',
    statusCode: 500,
    message: message,
    constructorOpt: InternalError
    /*
     ,body: {
     "error":{
     "code":'400',
     "message":message
     }
     }
     */

  });
  this.name = 'InternalError';
}

function BadRequest (message) {
  restify.RestError.call(this, {
    restCode: '400',
    statusCode: 400,
    message: message,
    constructorOpt: BadRequest
    /*
     ,body: {
     "error":{
     "code":'400',
     "message":message
     }
     }
     */

  });
  this.name = 'BadRequest';
}

function UnauthorizedRequest () {
  restify.RestError.call(this, {
    restCode: '401',
    statusCode: 401,
    message: 'Unauthorized',
    constructorOpt: UnauthorizedRequest
    /*
     ,body: {
     "error":{
     "code":'400',
     "message":message
     }
     }
     */

  });
  this.name = 'UnauthorizedRequest';
}

function InactiveAccount (message) {
  restify.RestError.call(this, {
    restCode: '401',
    statusCode: 401,
    message: message,
    constructorOpt: InactiveAccount
    /*
     ,body: {
     "error":{
     "code":'400',
     "message":message
     }
     }
     */

  });
  this.name = 'InactiveAccount';
}


util.inherits(BadRequest, restify.RestError);
util.inherits(UnauthorizedRequest, restify.RestError);
util.inherits(InactiveAccount, restify.RestError);


module.exports = exports = {
  InternalError: InternalError,
  BadRequest: BadRequest,
  UnauthorizedRequest: UnauthorizedRequest,
  InactiveAccount: InactiveAccount
};

