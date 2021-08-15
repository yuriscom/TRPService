var http = require('http');

function Hood () {
}

Hood.prototype = new handlers['1.0.0'].hood();

Hood.prototype.version = '1.0.1';


exports = module.exports = Hood;