var http = require('http');

function Event () {
}

Event.prototype = new handlers['1.0.0'].event();

Event.prototype.version = '1.0.1';


exports = module.exports = Event;