function Property () {
}

Property.prototype = new handlers['1.0.0'].property();

Property.prototype.version = '1.0.1';

/*
 Property.prototype.getById = function (id) {
 return {"message":"not implemented yet"};
 }
 */

exports = module.exports = Property;