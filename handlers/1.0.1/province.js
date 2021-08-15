var http = require('http');

function Province () {
}

Province.prototype = new handlers['1.0.0'].province();

Province.prototype.version = '1.0.1';


exports = module.exports = Province;