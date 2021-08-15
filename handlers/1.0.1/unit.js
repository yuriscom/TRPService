var http = require('http');

function Unit () {
}

Unit.prototype = new handlers['1.0.0'].unit();

Unit.prototype.version = '1.0.1';


exports = module.exports = Unit;