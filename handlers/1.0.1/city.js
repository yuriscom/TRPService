var http = require('http');

function City () {
}

City.prototype = new handlers['1.0.0'].city();

City.prototype.version = '1.0.1';


exports = module.exports = City;