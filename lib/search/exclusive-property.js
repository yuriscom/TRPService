function ExclusiveProperty () {
  // json object with all the data
  this.sqlObj = {};

  // where array of mixed array/object
  this.where = [];

  // limit of the query
  this.limit = ExclusiveProperty.defaultLimit;

  // page number to return, offset will be calculated from it
  this.page = 1;

  // order by
  this.sqlObj.order = [
    ['id', 'ASC'], ['is_public', 'DESC']
  ];

  this.sqlObj.include = [];
  this.include = {};

  this.responseLevel = '';

  this.version = '1.0.0';
}
exports = module.exports = ExclusiveProperty;

ExclusiveProperty.defaultLimit = 500;
ExclusiveProperty.maxLimit = 10000;

ExclusiveProperty.prototype.reset = function () {
  // json object with all the data
  this.sqlObj = {};

  // where array of mixed array/object
  this.where = [];

  // limit of the query
  this.limit = ExclusiveProperty.defaultLimit;

  // page number to return, offset will be calculated from it
  this.page = 1;

  // order by
  this.sqlObj.order = [
    ['id', 'ASC'], ['is_public', 'DESC']
  ];

  this.sqlObj.include = [];
  this.include = {};
};

/**
 * @param filters -- json of filters
 * @param responseLevel (optional)
 * @returns {{}|*} sqlObj
 */
ExclusiveProperty.prototype.getSqlObj = function (filters, responseLevel) {

  if ((responseLevel === undefined) || (['full', 'summary', 'simple', 'autocomplete'].indexOf(responseLevel) == -1)) {
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

ExclusiveProperty.prototype.getCountSqlObj = function (filters, responseLevel, isExact) {
  this.reset();
  if ((responseLevel === undefined) || (['full', 'summary', 'simple', 'autocomplete'].indexOf(responseLevel) == -1)) {
    responseLevel = 'simple';
  }

  this.responseLevel = responseLevel;

  this['_attr_' + responseLevel]();

  this.startWhere();

  this.addStaticFilters();

  for (var key in filters) {
    this.callFilter(key, filters[key]);
  }


  this.sqlObj.include = _.values(this.include);

  var idsSqlObj = _.clone(this.sqlObj);
  idsSqlObj.attributes = ['id'];
  idsSqlObj.includeIgnoreAttributes = false;
  idsSqlObj.distinct = true;

  return idsSqlObj;

};

/**
 * call the function that filters the query
 *
 * @param name -- name of the filter
 * @param val -- value of the filter
 */
ExclusiveProperty.prototype.callFilter = function (name, val) {
  if (typeof this['_filter_' + name] === 'function') {
    this['_filter_' + name](val);
  }
};


/**
 * add some filter that always exist
 */
ExclusiveProperty.prototype.addStaticFilters = function () {
  this.where.push(Sequelize.and(
      {lat: {ne: null}},
      {lat: {ne: -1}}
  )); // lat is not null
  this.where.push(Sequelize.and(
      {lng: {ne: null}},
      {lng: {ne: -1}}
  )); // lng is not null
//  this.where.push({property_type_id: {not: models.Property.getExcludedPropertyTypes()}}); // types excluded
// TODO: We need to talk...
//  this.where.push({property_style_id: {not: models.Property.getExcludedPropertyStyles()}}); // styles excluded
  this.where.push({is_out_of_area: 0}); // in the area
  this.where.push({exclusive_property_trp_type_id: { ne: null }});
  this.where.push({exclusive_property_status_id: 1}); // status active
  this.where.push({province_id: {ne: null}}); // status active
//  this.where.push({is_public: 1 }); // status active
//  this.where.push(['addr_province = ?', 'ontario']); // in ontario
  this.where.push(["addr_postal_code regexp '^[a-zA-Z5][0-9oO][a-zA-Z5]'"]); // postal code starts with LetterDigitLetter (5=S, o=0)

  if (this.responseLevel !== 'simple') {
    this.include.MainProvince =
    {
      model: models.MainProvince,
      attributes: ['id', 'web_id', 'name']
    };

    this.include.MainCity =
    {
      model: models.MainCity,
      attributes: ['id', 'web_id', 'name']
    };

    this.include.MainHood = {
      model: models.MainHood,
      attributes: ['id', 'web_id', 'name']
    };
  }
};

/**
 * after filtering add the array to sqlObj
 */
ExclusiveProperty.prototype.startWhere = function () {
  // pass this.where by reference and fill it up later with array of where clauses
  this.sqlObj.where = Sequelize.and(this.where);
};

// filters

ExclusiveProperty.prototype._filter_num = function (val) {
  if (__.isInt(val)) {
    this.limit = Math.min(val, ExclusiveProperty.maxLimit);
  }
};

ExclusiveProperty.prototype._filter_offset = function (val) {
  if (__.isInt(val) && val > 0) {
    this.offset = val;
  }
};

ExclusiveProperty.prototype._filter_page = function (val) {
  if (__.isInt(val) && val > 0) {
    this.page = val;
  }
};

ExclusiveProperty.prototype._filter_bounds = function (val) {

  if(val == null){
    return;
  }

  var boundsAr = val.split(',');

  if (boundsAr.length != 4) {
    return;
  }

  var lat1 = Math.min(boundsAr[0], boundsAr[2]);
  var lng1 = Math.min(boundsAr[1], boundsAr[3]);
  var lat2 = Math.max(boundsAr[0], boundsAr[2]);
  var lng2 = Math.max(boundsAr[1], boundsAr[3]);

  this.where.push({lat: {between: [lat1, lat2]}});
  this.where.push({lng: {between: [lng1, lng2]}});
};

ExclusiveProperty.prototype._filter_ids = function (val) {
  var idsAr = val.split(',');
  this.where.push({id: idsAr});
};

ExclusiveProperty.prototype._filter_order_by = function (val) {
  var orderAr = val.split('|');
  var paramsAr = [];

  if(orderAr.length > 1){
    _.each(orderAr, function(value, key){
      paramsAr.push(value.split(','));
    });
  }else{
    paramsAr.push(val.split(','));
  }

  this.sqlObj.order = paramsAr;
};

ExclusiveProperty.prototype._filter_is_public = function (val)
{
  this.where.push(['(is_public = ?)', val]);
};

ExclusiveProperty.prototype._filter_beds = function (val) {

  if (val === 'all') {
    return;
  }

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

ExclusiveProperty.prototype._filter_dom = function (val) {
  if (val === 'all') {
    return;
  }
  this.where.push({real_dom: {lte: val}});
};

ExclusiveProperty.prototype._filter_baths = function (val) {

  if (val === 'all') {
    return;
  }

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

ExclusiveProperty.prototype._filter_old_baths = function (val) {

  if (val === 'all') {
    return;
  }

  var pattern = /^([\d]+)(-plus)?$/i;
  var match = pattern.exec(val);
  if (match == null) {
    return;
  }
  if (!__.isInt(match[1])) {
    return;
  }

  this.where.push({num_baths: {gte: match[1]}});

};


ExclusiveProperty.prototype._filter_parking = function (val) {

  if (val === 'all') {
    return;
  }

  var params = val.split(',');
  var pattern = /^([\d]+)(-plus)?$/i;
  var singleParams = [];
  var plusParam;

  _.each(params, function (param){

    var match = pattern.exec(param);
    if (match == null) {
      return;
    }
    if (!__.isInt(match[1])) {
      return;
    }

    if (match[2] !== undefined) {
      plusParam = match[1];
    } else {
      singleParams.push(match[1]);
    }
  });

  if(plusParam == undefined){
    this.where.push({num_parkings: singleParams});
  }else if(singleParams.length > 0){
    this.where.push(
        Sequelize.or(
            { num_parkings: singleParams },
            { num_parkings: {gte: plusParam} }
        )
    );
  }else{
    this.where.push({num_parkings: {gte: plusParam}});
  }
};

ExclusiveProperty.prototype._filter_min_price = function (val) {
  if (!__.isInt(val)) {
    return;
  }

  this.where.push({price: {gte: val}});
};

ExclusiveProperty.prototype._filter_max_price = function (val) {
  if (!__.isInt(val)) {
    return;
  }

  this.where.push({price: {lte: val}});
};

ExclusiveProperty.prototype._filter_age = function (val) {
  if (val === 'any') {
    return;
  }
  var ageAr = [''];
  switch (val){
    case '0-5':
      ageAr.push('New', 'New.', '0-5');
      this.where.push({age: ageAr});
      break;
    case '6-15':
      ageAr.push('6-10', '6-15', '11-15');
      this.where.push({age: ageAr});
      break;
    case '16-30':
      ageAr.push('16-30');
      this.where.push({age: ageAr});
      break;
    case '31-50':
      ageAr.push('31-50');
      this.where.push({age: ageAr});
      break;
    case '51-99':
      ageAr.push('51-99');
      this.where.push({age: ageAr});
      break;
    case '100-plus':
      ageAr.push('100+');
      this.where.push({age: ageAr});
      break;
    default:
      this.where.push({age: ageAr});
      break;
  }

};

ExclusiveProperty.prototype._filter_city = function (val) {

  if (_.isArray(val)) {
    val = val.toString();
  }
  var cityAr = val.split(',');

  this.where.push({city_id: cityAr});

  if (!_.has(this.include, 'MainCity')) {
    var attributes = (this.responseLevel == 'simple' ? [] : ['id']);
    this.include.MainCity =
    {
      model: models.MainCity,
      attributes: ['id', 'web_id', 'name']
    };
  }

};

ExclusiveProperty.prototype._filter_hood = function (val) {

  if (_.isArray(val)) {
    val = val.toString();
  }
  var hoodAr = val.split(',');
  this.where.push({hood_id: hoodAr});

  if (!_.has(this.include, 'MainHood')) {
    var attributes = (this.responseLevel == 'simple' ? [] : ['id']);
    this.include.MainHood =
    {
      model: models.MainHood,
      attributes: ['id', 'web_id', 'name']
    };
  }

};

ExclusiveProperty.prototype._filter_old_hood = function (val) {

  if (_.isArray(val)) {
    val = val.toString();
  }
  var hoodAr = val.split(',');

  if (!_.has(this.include, 'Hood')) {
    var attributes = (this.responseLevel == 'simple' ? [] : ['id']);
    this.include.Hood = {
      model: models.EntityArea,
      attributes: attributes,
      as: 'EntityAreaHood',
      where: {entity_type: 'exclusive-property', area_type: 'hood'},
      include: [
        {model: models.Hood, as: 'Hood', attributes: ['id', 'web_id', 'name']}
      ]
    };
  }
  this.include.Hood.where.area_id = hoodAr;

};


ExclusiveProperty.prototype._filter_old_city = function (val) {

  if (_.isArray(val)) {
    val = val.toString();
  }
  var cityAr = val.split(',');

  if (!_.has(this.include, 'City')) {
    var attributes = (this.responseLevel == 'simple' ? [] : ['id']);
    this.include.City =
    {
      model: models.EntityArea,
      attributes: attributes,
      as: 'EntityAreaCity',
      where: {entity_type: 'exclusive-property', area_type: 'city'},
      include: [
        {model: models.City, as: 'City', attributes: ['id', 'web_id', 'name']}
      ]
    };
  }
  this.include.City.where.area_id = cityAr;

};


ExclusiveProperty.prototype._filter_province = function (val) {

  if (!_.has(this.include, 'MainProvince')) {
    var attributes = (this.responseLevel == 'simple' ? [] : ['id']);
    this.where.push({province_id: val});
    this.include.MainProvince =
    {
      model: models.MainProvince,
      attributes: ['id', 'web_id', 'name']
    };
  }
};

ExclusiveProperty.prototype._filter_region = function (val) {

  if (_.isArray(val)) {
    val = val.toString();
  }
  var regionAr = val.split(',');
  this.where.push({region_id: regionAr});

  if (!_.has(this.include, 'MainRegion')) {
    var attributes = (this.responseLevel == 'simple' ? [] : ['id']);
    this.include.MainRegion =
    {
      model: models.MainRegion,
      required: false,
      attributes: ['id', 'web_id', 'name']
    };
  }
};

ExclusiveProperty.prototype._filter_type = function (val) {

  if (_.isArray(val)) {
    val = val.toString();
  }
  var typeAr = val.split(',');

  var realTypeAr = [];

  _.each(typeAr, function (type) {
    realTypeAr.push(type);
  });

  _.each(this.include, function (include) {
    if (include.model.name == 'ExclusivePropertyTrpType') {
      include.where = {sys_name: realTypeAr};
    }
  });
};

ExclusiveProperty.prototype._filter_property_type = function (val) {

  if(val === null || val === ''){
    return;
  }

  if (_.isArray(val)) {
    val = val.toString();
  }

  var mappedAr = [];
  var typeAr = val.split(',');

  _.each(typeAr, function (propertyType){

    if(propertyType === 'condo-townhouse'){
      mappedAr.push('Condo Townhouse','Det Condo','Semi-Det Condo');
    }

    switch(propertyType){
      case 'detached':
        mappedAr.push('Det Condo', 'Det W/Com Elements','Detached');
        break;
      case 'semi-detached':
        mappedAr.push('Semi-Det Condo','Semi-Detached');
        break;
      case 'townhouse':
        mappedAr.push('Att/Row/Twnhouse');
        break;
      case 'condo-apt':
      case 'condo-apartment':
        mappedAr.push('Condo Apt','Co-Op Apt','Co-Ownership Apt');
        break;
      case 'multi-unit':
        mappedAr.push('Duplex','Fourplex','Multiplex','Triplex');
        break;
      case 'loft':
        mappedAr.push('Condo Apt','Co-Op Apt','Co-Ownership Apt');
        break;
      case 'bungalow':
        mappedAr.push('Det Condo', 'Det W/Com Elements','Detached');
        break;
      case 'other':
        mappedAr.push('Comm Element Condo','Upper Level','Link','New','Time Share','Cottage','Rural Resid','Lower Level');
        break;
    }
  });

  // Property type and style condition that match RES (1.0) search query.
  this.where.push({exclusive_property_type_id: {not: models.ExclusiveProperty.getExcludedPropertyTypes()}});
  this.where.push({exclusive_property_style_id: {not: models.ExclusiveProperty.getExcludedPropertyStyles()}});

  this.include.ExclusivePropertyType = {
    model: models.ExclusivePropertyType,
    required:true,
    where: {name: _.uniq(mappedAr)}
  };

};



ExclusiveProperty.prototype._filter_since = function (val) {

  var date = val;
  var eventTypeAr = ['NEW LISTING', 'LISTING ACTIVATED', 'PRICE UP', 'PRICE DOWN'];


  this.include.ListingChagelog = {
    model: models.ListingChangelog,
    attributes: ['id', 'changed_field', 'prev_value', 'new_value', 'event', 'updated_on'],
    where: {listing_type: 'resale', updated_on: {gte: date}, event: eventTypeAr}
  };

};

ExclusiveProperty.prototype._filter_match = function (val) {

  val = decodeURI(val);
  var param = '%' + val + '%';
  this.where.push(['(addr_full like ? OR mls_num like ?)', param, param]);
};

ExclusiveProperty.prototype._filter_mls = function (val) {
  this.where.push(['(mls_num = ?)', val]);
};

// attributes
ExclusiveProperty.prototype._attr_simple = function () {
// [ 'is_public', 'addr_full_slug', 'mls_num', 'addr_postal_code'];
  this.sqlObj.attributes = ['id', 'lat', 'lng', 'price', 'is_public'];
  //this.sqlObj.includeIgnoreAttributes = false;
  this.include.ExclusivePropertyTrpType = { model: models.ExclusivePropertyTrpType, attributes: ['name'] };
};

ExclusiveProperty.prototype._attr_summary = function () {
  this.sqlObj.attributes = [
    'id', 'addr_full', 'addr_street_num', 'addr_street', 'addr_unit_num', 'price', 'num_beds', 'num_baths', 'sqft', 'is_public',
    'addr_full_slug', 'addr_city_slug', 'addr_postal_code', 'mls_num', ['real_dom', 'dom']
  ];
  this.include.ExclusivePropertyTrpType = { model: models.ExclusivePropertyTrpType, attributes: [ 'id', 'name'] };
};

ExclusiveProperty.prototype._attr_autocomplete = function () {
  this.sqlObj.attributes = ['id', 'addr_full', 'addr_full_slug', 'addr_city_slug', 'mls_num', 'addr_postal_code'];
};


ExclusiveProperty.prototype._attr_reverse_saved_search = function () {
  this.sqlObj.attributes = ['id', 'user_id'];
};

ExclusiveProperty.prototype._attr_full = function () {
  this._attr_summary();
  delete this.sqlObj.attributes;
};
