function Walkscore () {
}

Walkscore.prototype.version = '1.0.1';
Walkscore.prototype = new handlers['1.0.0'].walkscore();

exports = module.exports = Walkscore;