var http = require('http');

function Region () {
}

Region.prototype = new handlers['1.0.0'].region();

Region.prototype.version = '1.0.1';


exports = module.exports = Region;