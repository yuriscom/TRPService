function Builder () {
  // json object with all the data
  this.sqlObj = {};

  // where array of mixed array/object
  this.where = [];

  // limit of the query
  this.limit = Builder.defaultLimit;

  // page number to return, offset will be calculated from it
  this.page = 1;

  // order by
  this.sqlObj.order = [
    ['id', 'ASC']
  ];

  this.sqlObj.include = [];
  this.include = {};

  this.responseLevel = '';
}
exports = module.exports = Builder;

Builder.defaultLimit = 10000;
Builder.maxLimit = 10000;

Builder.prototype.reset = function () {
  // json object with all the data
  this.sqlObj = {};

  // where array of mixed array/object
  this.where = [];

  // limit of the query
  this.limit = Builder.defaultLimit;

  // page number to return, offset will be calculated from it
  this.page = 1;

  // order by
  this.sqlObj.order = [
    ['id', 'ASC']
  ];

  this.sqlObj.include = [];
  this.include = {};
};

/**
 * @param filters -- json of filters
 * @param responseLevel (optional)
 * @returns {{}|*} sqlObj
 */
Builder.prototype.getSqlObj = function (filters, responseLevel, nested) {

  if ((responseLevel === undefined) || (['full', 'summary', 'simple'].indexOf(responseLevel) == -1)) {
    responseLevel = 'simple';
  }
  this.responseLevel = responseLevel;

  this['_attr_' + responseLevel]();

  this.startWhere();

  for (var key in filters) {
    this.callFilter(key, filters[key]);
  }

  this.addStaticFilters();

  this.sqlObj.limit = this.limit;
  this.sqlObj.offset = this.offset ? this.offset : this.page ? ((this.page - 1) * this.limit) : 0;

  this.sqlObj.include = _.values(this.include);
  this.sqlObj.include = _.values(this.include);
  return this.sqlObj;
};


/**
 * call the function that filters the query
 *
 * @param name -- name of the filter
 * @param val -- value of the filter
 */
Builder.prototype.callFilter = function (name, val) {
  if (typeof this['_filter_' + name] === 'function') {
    this['_filter_' + name](val);
  }
};


/**
 * add some filter that always exist
 */
Builder.prototype.addStaticFilters = function () {
  this.where.push({web_id: {ne: null}});
};

/**
 * after filtering add the array to sqlObj
 */
Builder.prototype.startWhere = function () {
  // pass this.where by reference and fill it up later with array of where clauses
  this.sqlObj.where = Sequelize.and(this.where);
};

// filters
Builder.prototype._filter_ids = function (val) {
  var idsAr = val.split(',');
  this.where.push({id: idsAr});
};

Builder.prototype._filter_order_by = function (val) {
  var paramsAr = [val.split(',')];
  this.sqlObj.order = paramsAr;
};

Builder.prototype._filter_match = function (val) {

  val = decodeURI(val);
  var param = '%' + val + '%';
  this.where.push(['(web_id like ? OR name like ?)', param, param]);
};

Builder.prototype._filter_name = function (val) {
  this.where.push({web_id: __.convertToWebId(val)});
};

Builder.prototype._filter_num = function (val) {
  if (__.isInt(val)) {
    this.limit = Math.min(val, Builder.maxLimit);
  }
};

Builder.prototype._filter_offset = function (val) {
  if (__.isInt(val) && val > 0) {
    this.offset = val;
  }
};

// attributes
Builder.prototype._attr_simple = function () {

  this.sqlObj.attributes = ['id', 'name', 'web_id'];
  //this.sqlObj.includeIgnoreAttributes = false;

};

