function Resource () {
}

Resource.prototype = new handlers['1.0.0'].resource();
Resource.prototype.version = '1.0.1';


exports = module.exports = Resource;
