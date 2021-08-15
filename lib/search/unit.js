function Unit () {
  // json object with all the data
  this.sqlObj = {};

  // where array of mixed array/object
  this.where = [];

  // limit of the query
  this.limit = Unit.defaultLimit;

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
exports = module.exports = Unit;

Unit.defaultLimit = 500;
Unit.maxLimit = 10000;

/**
 * @param filters -- json of filters
 * @param responseLevel (optional)
 * @returns {{}|*} sqlObj
 */
Unit.prototype.getSqlObj = function (filters, responseLevel) {
  if ((responseLevel === undefined) || (['full', 'summary', 'simple'].indexOf(responseLevel) == -1)) {
    responseLevel = 'simple';
  }
  this.responseLevel = responseLevel;

  this.include.Precon = { name: 'Precon', model: models.Precon, attributes: ['id', 'name', 'lat', 'lng'], where: [] };


  this['_attr_' + responseLevel]();

  this.startWhere();

  for (var key in filters) {
    this.callFilter(key, filters[key]);
  }

  this.addStaticFilters();

  this.sqlObj.limit = this.limit;
  this.sqlObj.offset = (this.page ? ((this.page - 1) * this.limit) : 0);

  this.sqlObj.include = _.values(this.include);

  return this.sqlObj;
};

/**
 * call the function that filters the query
 *
 * @param name -- name of the filter
 * @param val -- value of the filter
 */
Unit.prototype.callFilter = function (name, val) {
  if (typeof this['_filter_' + name] === 'function') {
    this['_filter_' + name](val);
  }
};


/**
 * add some filter that always exist
 */
Unit.prototype.addStaticFilters = function () {
  this.include.Precon.where.push({lat: {ne: null}});
  this.include.Precon.where.push({lng: {ne: null}});
  this.include.Precon.where.push({hidden: 0});
  this.where.push({hidden: 0});
};

/**
 * after filtering add the array to sqlObj
 */
Unit.prototype.startWhere = function () {
  // pass this.where by reference and fill it up later with array of where clauses
  this.sqlObj.where = Sequelize.and(this.where);
};

// filters

Unit.prototype._filter_num = function (val) {
  if (__.isInt(val)) {
    this.limit = Math.min(val, Unit.maxLimit);
  }
};

Unit.prototype._filter_page = function (val) {
  if (__.isInt(val) && (val > 0)) {
    this.page = val;
  }
};

Unit.prototype._filter_bounds = function (val) {
  var boundsAr = val.split(',');
  if (boundsAr.length != 4) {
    return;
  }

  var lat1 = Math.min(boundsAr[0], boundsAr[2]);
  var lng1 = Math.min(boundsAr[1], boundsAr[3]);
  var lat2 = Math.max(boundsAr[0], boundsAr[2]);
  var lng2 = Math.max(boundsAr[1], boundsAr[3]);

  this.include.Precon.where.push({lat: {between: [lat1, lat2]}});
  this.include.Precon.where.push({lng: {between: [lng1, lng2]}});
};

Unit.prototype._filter_ids = function (val) {
  var idsAr = val.split(',');
  this.include.Precon.where.push({id: idsAr});
};

Unit.prototype._filter_order_by = function (val) {
  var paramsAr = [val.split(',')];
  this.sqlObj.order = paramsAr;
};

Unit.prototype._filter_beds = function (val) {
  var pattern = /^([\d]+)(-plus)?$/i;
  var match = pattern.exec(val);
  if (match == null) {
    return;
  }
  if (!__.isInt(match[1])) {
    return;
  }

  if (match[2] !== undefined) {
    this.where.push({num_beds: {gte: match[1]}});
  } else {
    this.where.push({num_beds: match[1]});
  }
};

Unit.prototype._filter_baths = function (val) {
  var pattern = /^([\d]+)(-plus)?$/i;
  var match = pattern.exec(val);
  if (match == null) {
    return;
  }
  if (!__.isInt(match[1])) {
    return;
  }

  if (match[2] !== undefined) {
    this.where.push({num_baths: {gte: match[1]}});
  } else {
    this.where.push({num_baths: match[1]});
  }
};

Unit.prototype._filter_min_price = function (val) {
  if (!__.isInt(val)) {
    return;
  }

  //this.where.push({price: {gte: val}});
  this.where.push(
    Sequelize.or(
      {price: {gte: val}},
      { price: null}
    ));
};

Unit.prototype._filter_max_price = function (val) {
  if (!__.isInt(val)) {
    return;
  }

  this.where.push(
    Sequelize.or(
      {price: {lte: val}},
      {price: null}
    )
  );
};


// attributes
Unit.prototype._attr_simple = function () {
  this.sqlObj.attributes = ['id', 'price', 'name'];
  //this.sqlObj.includeIgnoreAttributes = false;

};

Unit.prototype._attr_summary = function () {
  this.sqlObj.attributes = ['id', 'name', 'num_beds', 'num_baths', 'price' ];
  this.include.Precon.attributes.push('addr_city', 'price_min', 'price_max');
};

Unit.prototype._attr_full = function () {

};
