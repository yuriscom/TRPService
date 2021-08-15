var http = require('http');

function Agent () {
}

Agent.prototype = new handlers['1.0.0'].agent();

Agent.prototype.version = '1.0.1';


exports = module.exports = Agent;