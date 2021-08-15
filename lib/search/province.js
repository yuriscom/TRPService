function Province () {
  // json object with all the data
  this.sqlObj = {};

  // where array of mixed array/object
  this.where = [];

  // limit of the query
  this.limit = Province.defaultLimit;

  // page number to return, offset will be calculated from it
  this.page = 1;

  this.nested = false;

  // order by
  this.sqlObj.order = [
    ['id', 'ASC']
  ];

  this.sqlObj.include = [];
  this.include = {};

  this.responseLevel = '';
}
exports = module.exports = Province;

Province.defaultLimit = 10000;
Province.maxLimit = 10000;

Province.prototype.reset = function () {
  // json object with all the data
  this.sqlObj = {};

  // where array of mixed array/object
  this.where = [];

  // limit of the query
  this.limit = Province.defaultLimit;

  this.nested = false;

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
Province.prototype.getSqlObj = function (filters, responseLevel, nested) {

  if ((responseLevel === undefined) || (['full', 'summary', 'simple'].indexOf(responseLevel) == -1)) {
    responseLevel = 'simple';
  }
  this.responseLevel = responseLevel;

  if (nested !== undefined && nested == 1) {
    this.nested = true;
  }

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
Province.prototype.callFilter = function (name, val) {
  if (typeof this['_filter_' + name] === 'function') {
    this['_filter_' + name](val);
  }
};


/**
 * add some filter that always exist
 */
Province.prototype.addStaticFilters = function () {
  this.where.push({web_id: {ne: null}});
};

/**
 * after filtering add the array to sqlObj
 */
Province.prototype.startWhere = function () {
  // pass this.where by reference and fill it up later with array of where clauses
  this.sqlObj.where = Sequelize.and(this.where);
};

// filters
Province.prototype._filter_ids = function (val) {
  var idsAr = val.split(',');
  this.where.push({id: idsAr});
};

Province.prototype._filter_order_by = function (val) {
  var paramsAr = [val.split(',')];
  this.sqlObj.order = paramsAr;
};

Province.prototype._filter_name = function (val) {
  this.where.push({web_id: __.convertToWebId(val)});
};

Province.prototype._filter_num = function (val) {
  if (__.isInt(val)) {
    this.limit = Math.min(val, Province.maxLimit);
  }
};

Province.prototype._filter_offset = function (val) {
  if (__.isInt(val) && val > 0) {
    this.offset = val;
  }
};

// attributes
Province.prototype._attr_simple = function () {

  this.sqlObj.attributes = ['id', 'name', 'web_id'];
  //this.sqlObj.includeIgnoreAttributes = false;

  if (this.nested) {
    this.include.Region = {
      model: models.MainRegion,
      attributes: ['id', 'name', 'web_id'],
      as: 'Region',
      include: {
        model: models.MainCity,
        attributes: ['id', 'name', 'web_id'],
        as: 'City',
        include: {
          model: models.MainHood,
          attributes: ['id', 'name', 'web_id'],
          as: 'Hood'
        }
      }
    };
  }

};

