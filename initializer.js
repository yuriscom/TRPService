// global variables
PATH = __dirname;
_ = require('underscore');
_.string = require('underscore.string');
_.mixin(_.string.exports());
rp = require('request-promise');

// local variables
var restify = require('restify')
  , server = restify.createServer()
  , environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , Server = require('mongodb').Server
  , winston = require('winston');


//Sequelize = require(PATH + '/lib/sequelize');
Sequelize = require(PATH + '/lib/sequelize_new');

sequelize = new Sequelize(
  environment.database.database,
  environment.database.username,
  environment.database.password,
  environment.database
);

winston.add(winston.transports.File, { filename: 'winston.log' });
winston.handleExceptions(new winston.transports.File({ filename: 'exceptions.log' }));

__ = require(PATH + '/functions');

models = require('./models')(sequelize);

//models = require('./models2')(sequelize);

require(PATH + '/db/associator');

require(PATH + '/db/hooks');

routes = require('./routes')(server);

tokenLife = environment.security.tokenLife;

module.exports = server;