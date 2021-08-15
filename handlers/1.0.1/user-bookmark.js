function UserBookmark () {
}

UserBookmark.prototype = new handlers['1.0.0']['user-bookmark']();

UserBookmark.prototype.version = '1.0.1';


exports = module.exports = UserBookmark;