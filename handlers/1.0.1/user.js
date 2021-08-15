function User () {
}

User.prototype.version = '1.0.1';
User.prototype = new handlers['1.0.0'].user();


exports = module.exports = User;