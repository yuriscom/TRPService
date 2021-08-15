function SavedSearch () {
}

SavedSearch.prototype = new handlers['1.0.0']['saved-search']();

SavedSearch.prototype.version = '1.0.1';

exports = module.exports = SavedSearch;
