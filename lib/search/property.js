function Property () {
  // json object with all the data
  this.sqlObj = {};

  // where array of mixed array/object
  this.where = [];

  // limit of the query
  this.limit = Property.defaultLimit;

  // page number to return, offset will be calculated from it
  this.page = 1;

  // order by
  this.sqlObj.order = [
    ['id', 'ASC'], ['is_public', 'DESC']
  ];

  this.sqlObj.doSubQuery = true;

  // strip listings without empty, null values
  this.isComplete = false;

  // if assets_exact is true, returns exactly `assetsNum` images
  // otherwise it returns `assetsNum` or more images
  this.assetsNum = null;

  this.sqlObj.include = [];
  this.include = {};

  this.responseLevel = '';

  this.version = '1.0.0';
}
exports = module.exports = Property;

Property.defaultLimit = 500;
Property.maxLimit = 10000;

Property.prototype.reset = function () {
  // json object with all the data
  this.sqlObj = {};

  // where array of mixed array/object
  this.where = [];

  // limit of the query
  this.limit = Property.defaultLimit;

  // page number to return, offset will be calculated from it
  this.page = 1;

  // strip listings without empty, null values
  this.isComplete = false;

  // if assets_exact is true, returns exactly `assetsNum` images
  // otherwise it returns `assetsNum` or more images
  this.assetsNum = null;

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
Property.prototype.getSqlObj = function (filters, responseLevel) {
  if ((responseLevel === undefined) || (['full', 'summary', 'simple', 'autocomplete', 'listview'].indexOf(responseLevel) == -1)) {
    responseLevel = 'simple';
  }

  // checks if response should only contain listings with no nulls or emptys (complete listings)
  this.isComplete = filters.is_complete !== undefined && filters.is_complete == 1;

  // if assets_exact == 0, then this variable will be used for the query
  if (filters.assets_num) {
    this.assetsNum = parseInt(filters.assets_num);
  }

  this.responseLevel = responseLevel;

  this['_attr_' + responseLevel]();

  this.startWhere();

  this.addStaticFilters();

  for (var key in filters) {
    this.callFilter(key, filters[key]);
  }

  //return {
  //  include: [{model: models.ListingChangelog, as: 'ListingChangelog', where: {listing_type:'resale'}}],
  //  where: ['Property.id in (12123, 32)'],
  //  limit:3,
  //  order: 'Property.id DESC',
  //  doSubQuery:true
  //};


  this.addStaticFilters();

  this.sqlObj.limit = this.limit;
  this.sqlObj.offset = this.offset ? this.offset : this.page ? ((this.page - 1) * this.limit) : 0;

  if(filters.isAuthenticated === true && responseLevel !== 'autocomplete'){
    this.include.UserBookmarks = {
      model: models.UserBookmark,
      where: {user_id: filters.authenticatedId, listing_type: 'resale', is_deleted: false},
      required: false
    }
  }

  this.sqlObj.include = _.values(this.include);
  return Promise.resolve(this.sqlObj);

  /*
  var self = this;

  if (filters.polygon) {
    return models.PropertyGeom.findAll(
      {
        attributes : ['property_id'],
        where: ["st_contains(envelope(GeomFromText('" + filters.polygon + "')), pt)"]
      }
    ).then(function (idsResults) {
      var ids = idsResults.map(function (idObj) {
        return idObj.toJSON().property_id;
      });

      if (ids.length) {
        self.where.push(['Property.id in (' + ids.join(', ') + ')']);
      } else {
        self.where.push(['Property.id is null']);
      }

      return self.sqlObj;
    });
  } else {
    return Promise.resolve(this.sqlObj);
  }
  */
};

Property.prototype.getCountSqlObj = function (filters, responseLevel) {
  this.reset();
  if ((responseLevel === undefined) || (['full', 'summary', 'simple', 'autocomplete'].indexOf(responseLevel) == -1)) {
    responseLevel = 'simple';
  }

  // checks if response should only contain listings with no nulls or emptys (complete listings)
  this.isComplete = filters.is_complete !== undefined && filters.is_complete == 1;

  // if assets_exact == 0, then this variable will be used for the query
  if (filters.assets_num) {
    this.assetsNum = parseInt(filters.assets_num);
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
Property.prototype.callFilter = function (name, val) {
  if (typeof this['_filter_' + name] === 'function') {
    this['_filter_' + name](val);
  }
};


/**
 * add some filter that always exist
 */
Property.prototype.addStaticFilters = function () {
  this.where.push(Sequelize.and(
      {lat: {ne: null}},
      {lat: {ne: -1}}
  )); // lat is not null
  this.where.push(Sequelize.and(
      {lng: {ne: null}},
      {lng: {ne: -1}}
  )); // lng is not null
  this.where.push({listing_type_id: 1}); // for sale (not rent)
//  this.where.push({property_type_id: {not: models.Property.getExcludedPropertyTypes()}}); // types excluded
// TODO: We need to talk...
//  this.where.push({property_style_id: {not: models.Property.getExcludedPropertyStyles()}}); // styles excluded
  this.where.push({is_out_of_area: 0}); // in the area
  this.where.push({property_trp_type_id: { ne: null }});
  this.where.push({property_status_id: 1}); // status active
  this.where.push({province_id: {ne: null}}); // status active
//  this.where.push({is_public: 1 }); // status active
//  this.where.push(['addr_province = ?', 'ontario']); // in ontario
  this.where.push(["addr_postal_code regexp '^[a-zA-Z5][0-9oO][a-zA-Z5]'"]); // postal code starts with LetterDigitLetter (5=S, o=0)

  if (this.isComplete === true) {

    // sqft is not null and not an empty string
    this.where.push(Sequelize.and(
        {sqft: { ne: null }},
        {sqft: { ne: "" }}
    ));

    // beds + baths is not empty
    this.where.push({num_beds: { ne: null }});
    this.where.push({num_beds_plus: { ne: null }});
    this.where.push({num_baths: { ne: null }});

    // description is not empty
    this.where.push(Sequelize.and(
      {client_remarks: { ne: null }},
      {client_remarks: { ne: "" }}
    ));

    // taxes is not null or 0
    this.where.push(Sequelize.and(
      {taxes: { ne: null }},
      {taxes: { ne: 0 }}
    ));

    // price is not null or 0
    this.where.push(Sequelize.and(
      {price: { ne: null }},
      {price: { ne: 0 }}
    ));

    // dom is not null or 0
    this.where.push(Sequelize.and(
      {dom: { ne: null }}
    ));

  }

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
Property.prototype.startWhere = function () {
  // pass this.where by reference and fill it up later with array of where clauses
  this.sqlObj.where = Sequelize.and(this.where);
};

// filters

Property.prototype._filter_num = function (val) {
  if (__.isInt(val)) {
    this.limit = Math.min(val, Property.maxLimit);
  }
};

Property.prototype._filter_property_status = function (val) {
  var self = this;
  if (!__.isInt(val) && val != 'all' ) return;

  // Remove property_status_id where clause set by staticFilers
  _.each(this.where, function (obj, index) {
    if (_.has(obj, 'property_status_id')) {
      this.where.splice(index, 1);
    }
  }, this);

  if (__.isInt(val)) {
    this.where.push({ property_status_id: val });
  }
};

Property.prototype._filter_offset = function (val) {
  if (__.isInt(val) && val > 0) {
    this.offset = val;
  }
};

Property.prototype._filter_page = function (val) {
  if (__.isInt(val) && val > 0) {
    this.page = val;
  }
};

Property.prototype._filter_bounds = function (val) {
  if(!val){
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

Property.prototype._filter_ids = function (val) {
  if (!val) {
    return;
  }
  var idsAr = val.split(',');
  this.where.push({id: idsAr});
};

Property.prototype._filter_is_syndicated = function (val) {
  if (val === undefined || val == 0) {
    return;
  }

  this.where.push(["broker LIKE '%TheRedPin%'"]);
}

Property.prototype._filter_order_by = function (val) {
  if (!val) {
    return;
  }
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

Property.prototype._filter_is_public = function (val) {
  if (val === '' || val === undefined) {
    return;
  }
  this.where.push(['(is_public = ?)', val]);
};

Property.prototype._filter_beds = function (val) {
  if (val === 'all' || val === '' || val === undefined) {
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

Property.prototype._filter_dom = function (val) {
  if (val === 'all' || val === '' || val === undefined) {
    return;
  }
  this.where.push({real_dom: {lte: val}});
};

Property.prototype._filter_baths = function (val) {

  if (!val || val === 'all') {
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

Property.prototype._filter_old_baths = function (val) {

  if (!val || val === 'all') {
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


Property.prototype._filter_parking = function (val) {

  if (!val || val === 'all') {
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

Property.prototype._filter_min_price = function (val) {
  if (!__.isInt(val)) {
    return;
  }

  this.where.push({price: {gte: val}});
};

Property.prototype._filter_max_price = function (val) {
  if (!__.isInt(val)) {
    return;
  }

  this.where.push({price: {lte: val}});
};

Property.prototype._filter_age = function (val) {
  if (!val || val === 'any') {
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

Property.prototype._filter_metro = function (val) {

  // These are currently hardcoded, ideally we need a new Metro area type
  metros = {
    gta: [1229,1222,1195,1194,1182,1163,1120,1108,1072,1053,997,986,980,915,905,895,838,836,787,769,754,704,697,695,693],
    gva: [39,81,91,223,280,283,349,363,380,404,452,482,526,542,622,647]
  }
  var city_ids = metros[val] || [];

  this.where.push({city_id: city_ids});

};

Property.prototype._filter_city = function (val) {

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

Property.prototype._filter_hood = function (val) {

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

Property.prototype._filter_old_hood = function (val) {

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
      where: {entity_type: 'resale', area_type: 'hood'},
      include: [
        {model: models.Hood, as: 'Hood', attributes: ['id', 'web_id', 'name']}
      ]
    };
  }
  this.include.Hood.where.area_id = hoodAr;

};


Property.prototype._filter_old_city = function (val) {

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
      where: {entity_type: 'resale', area_type: 'city'},
      include: [
        {model: models.City, as: 'City', attributes: ['id', 'web_id', 'name']}
      ]
    };
  }
  this.include.City.where.area_id = cityAr;

};


Property.prototype._filter_province = function (val) {

  if (__.isInt(val) && !_.has(this.include, 'MainProvince')) {
    var attributes = (this.responseLevel == 'simple' ? [] : ['id']);
    this.where.push({province_id: val});
    this.include.MainProvince =
    {
      model: models.MainProvince,
      attributes: ['id', 'web_id', 'name']
    };
  }
};

Property.prototype._filter_region = function (val) {
  if (!val) {
    return;
  }
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

Property.prototype._filter_type = function (val) {

  if(val) {
    if (_.isArray(val)) {
      val = val.toString();
    }
    var typeAr = val.split(',');

    var realTypeAr = [];

    _.each(typeAr, function (type) {
      realTypeAr.push(type);
    });

    _.each(this.include, function (include) {
      if (include.model.name == 'PropertyTrpType') {
        include.where = {sys_name: realTypeAr};
      }
    });
  }
};

Property.prototype._filter_property_type = function (val) {

  if(!val){
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
  this.where.push({property_type_id: {not: models.Property.getExcludedPropertyTypes()}});
  this.where.push({property_style_id: {not: models.Property.getExcludedPropertyStyles()}});

  this.include.PropertyType = {
    model: models.PropertyType,
    required:true,
    where: {name: _.uniq(mappedAr)}
  };

};


Property.prototype._filter_polygon = function(val) {
  /*st_contains(
  envelope(GeomFromText('POLYGON((-79.31621411999998 43.665552,-79.32354407999998 43.683379020000075,-79.32490487999996 43.68662298000004,-79.31413295999994 43.688940030000026,-79.31128391999994 43.682193,-79.30788191999994 43.673904,-79.31022983999998 43.67185299000004,-79.31301803999997 43.66633698000004,-79.31621411999998 43.665552))'))
    , point(lng, lat)
  )
  */
  if (_.isArray(val)) {
    //this.where.push(["(st_contains(envelope(GeomFromText('" + val[0] + "')), point(lng, lat)) or st_contains(envelope(GeomFromText('" + val[1] + "')), point(lng, lat)))"]);
    var qAr = [];
    val.forEach(function(poly){
      qAr.push("st_contains(envelope(GeomFromText('" + poly + "')), point(lng, lat))");
    })

    this.where.push(["(" + qAr.join(" or ") + ")"]);

  } else {
    this.where.push(["st_contains(envelope(GeomFromText('" + val + "')), point(lng, lat))"]);
  }
}


Property.prototype._filter_since = function (val) {
  if (!val) {
    return;
  }
  var date = val;
  var eventTypeAr = ['NEW LISTING', 'LISTING ACTIVATED', 'PRICE UP', 'PRICE DOWN'];


  this.include.ListingChagelog = {
    model: models.ListingChangelog,
    attributes: ['id', 'changed_field', 'prev_value', 'new_value', 'event', 'updated_on'],
    where: {listing_type: 'resale', updated_on: {gte: date}, event: eventTypeAr}
  };

};

Property.prototype._filter_assets_exact = function(val) {
  // check the value of assets_exact
  var assetsExact = (val === undefined) || (val == 1);

  // No matter what the value of assetsExact is, if assetsNum is null, then there's nothing to be done
    // assetsExact must be false and assetsNum must be set, to join with the resource temp table
  if(this.assetsNum === null || assetsExact) {
    return;
  }

  this.include.ResourceTemp = {
    model: models.ResourceTemp,
    // inner join to ensure we only join properties that have images in the resource temp table
    required: true
  };

  // Just in case another entity type related to properties is added to the database
  this.where.push(["ResourceTemps.entity_type='property'"]);

  // count how many images are associated to each property id
  this.sqlObj.having = ['COUNT(?) >= ?', 'ResourceTemps.path', this.assetsNum];
  this.sqlObj.group = ['ResourceTemps.entity_id'];
}

Property.prototype._filter_match = function (val) {
  if (!val) {
    return;
  }
  val = decodeURI(val);
  var param = '%' + val + '%';
  this.where.push(['(addr_full like ? OR mls_num like ?)', param, param]);
};

Property.prototype._filter_mls = function (val) {
  if (!val) {
    return;
  }
  this.where.push(['(mls_num = ?)', val]);
};

// attributes
Property.prototype._attr_simple = function () {
// [ 'is_public', 'addr_full_slug', 'mls_num', 'addr_postal_code'];
  this.sqlObj.attributes = ['id', 'lat', 'lng', 'price', 'created_on', 'is_public'];
  //this.sqlObj.includeIgnoreAttributes = false;
  this.include.PropertyTrpType = { model: models.PropertyTrpType, attributes: ['name'] };
};

Property.prototype._attr_summary = function () {
  this.sqlObj.attributes = [
    'id', 'addr_full', 'addr_street_num', 'addr_street', 'addr_unit_num', 'price', 'num_beds', 'num_beds_plus', 'num_baths', 'sqft', 'is_public',
    'addr_full_slug', 'addr_city_slug', 'addr_postal_code', 'mls_num', ['real_dom', 'dom']
  ];
  this.include.PropertyTrpType = { model: models.PropertyTrpType, attributes: [ 'id', 'name'] };
};

Property.prototype._attr_listview = function () {
  this.sqlObj.attributes = [
    'id', 'addr_full', 'addr_street_num', 'addr_street', 'addr_unit_num', 'addr_province', 'price', 'num_beds', 'num_beds_plus', 'num_baths', 'sqft', 'is_public',
    'addr_full_slug', 'addr_city_slug', 'addr_postal_code', 'mls_num', 'client_remarks', 'lat', 'lng',  'taxes', 'broker', 'monthly_maintenance',
    ['real_dom', 'dom']
  ];
  this.include.PropertyTrpType = { model: models.PropertyTrpType, attributes: [ 'id', 'name'] };
};

Property.prototype._attr_autocomplete = function () {
  this.sqlObj.attributes = ['id', 'addr_full', 'addr_full_slug', 'addr_city_slug', 'mls_num', 'addr_postal_code'];
};

Property.prototype._attr_full = function () {
  this._attr_summary();
  delete this.sqlObj.attributes;
};
