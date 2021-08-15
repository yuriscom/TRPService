function ResourceTemp () {
}

ResourceTemp.prototype = new handlers['1.0.0']['resource-temp']();
ResourceTemp.prototype.version = '1.0.1';


exports = module.exports = ResourceTemp;
