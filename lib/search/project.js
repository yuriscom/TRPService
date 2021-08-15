var when = require('when');

function Project () {
  // json object with all the data
  this.sqlObj = {};

  // where array of mixed array/object
  this.where = [];

  // limit of the query
  this.limit = Project.defaultLimit;

  // page number to return, offset will be calculated from it
  this.page = 1;

  // order by
  this.sqlObj.order = [
    ['id', 'ASC']
  ];

  //is Exact search
  this.isExact = false;

  // if assets_exact is true, returns exactly `assetsNum` images
  // otherwise it returns `assetsNum` or more images
  this.assetsNum = null;

  this.sqlObj.include = [];
  this.include = {};

  this.responseLevel = '';
}
exports = module.exports = Project;

Project.defaultLimit = 500;
Project.maxLimit = 10000;

Project.prototype.reset = function () {
  // json object with all the data
  this.sqlObj = {};

  // where array of mixed array/object
  this.where = [];

  // limit of the query
  this.limit = Project.defaultLimit;

  // page number to return, offset will be calculated from it
  this.page = 1;

  // order by
  this.sqlObj.order = [
    ['id', 'ASC']
  ];

  //is Exact search
  this.isExact = false;

  this.sqlObj.include = [];
  this.include = {};
};

/**
 * @param filters -- json of filters
 * @param responseLevel (optional)
 * @param isExact (optional)
 * @returns {{}|*} sqlObj
 */
Project.prototype.getSqlObj = function (filters, responseLevel, isExact) {
  this.reset();
  if ((responseLevel === undefined) || (['full', 'summary', 'simple', 'autocomplete', 'listview'].indexOf(responseLevel) == -1)) {
    responseLevel = 'simple';
  }

  if (isExact !== undefined && isExact == 1) {
    this.isExact = true;
  }

  // if assets_exact == 0, then assetsNum will be used for the query
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

  if(filters.isAuthenticated === true && responseLevel !== 'autocomplete'){
    this.include.UserBookmarks = {
      model: models.UserBookmark,
      where: {user_id: filters.authenticatedId, listing_type: 'presale', is_deleted: false},
      required: false
    }
  }

  this.sqlObj.include = _.values(this.include);

  var self = this;
  if (this.limit === 0) {
    //if limit is set explicitely to 0, don't do the limit subquery
    return when('').then(function () {
          return self.sqlObj;
        }
    );
  } else {
    // if there is a limit then need to query the ids first and add them to the filter (doctrine algorithm)
    var idsSqlObj = _.clone(this.sqlObj);
    idsSqlObj.attributes = ['id'];
    idsSqlObj.includeIgnoreAttributes = false;
    idsSqlObj.distinct = true;
    idsSqlObj.limit = this.limit;
    idsSqlObj.offset = this.offset ? this.offset : this.page ? ((this.page - 1) * this.limit) : 0;

    return models.Precon.findAll(idsSqlObj).then(function (idsResults) {
      var ids = idsResults.map(function (idObj) {
        return idObj.toJSON().id;
      });

      if (ids.length) {
        self.where.push(['Precon.id in (' + ids.join(', ') + ')']);
      } else {
        self.where.push(['Precon.id is null']);
      }

      return self.sqlObj;
    });
  }

};

Project.prototype.getCountSqlObj = function (filters, responseLevel, isExact) {
  this.reset();
  if ((responseLevel === undefined) || (['full', 'summary', 'simple', 'autocomplete', 'listview'].indexOf(responseLevel) == -1)) {
    responseLevel = 'simple';
  }

  if (isExact !== undefined && isExact == 1) {
    this.isExact = true;
  }

  // if assets_exact == 0, then assetsNum will be used for the query
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
Project.prototype.callFilter = function (name, val) {
  if (typeof this['_filter_' + name] === 'function') {
    this['_filter_' + name](val);
  }
};


/**
 * add some filter that always exist
 */
Project.prototype.addStaticFilters = function () {
  //this.where.push({lat: {ne: null}}); // lat is not null
  //this.where.push({lng: {ne: null}}); // lng is not null
  //this.where.push({hidden: 0}); // for sale (not rent)
  this.where.push({id: {ne: null}});

  this.where.push(['Precon.lat is not null']);
  this.where.push(['Precon.lng is not null']);
  this.where.push(['Precon.hidden = 0']);
  this.where.push(['Precon.province_id is not null']);

  if (this.isExact === true) {
    this.where.push(['PreconUnit.id is not null']);  // for exact search
  } else {
    this.where.push(['(PreconUnit.id is not null or Precon.num_floorplans=0)']);
  }

  this.include.PreconUnit = {
    model: models.PreconUnit,
    as: 'PreconUnit',
    attributes: ['id', 'is_comprehensive', 'num_beds', 'num_baths'],
    where: {
      is_comprehensive: 1,
      hidden: 0
    },
    required: false
  };

  this.include.PreconBuilder = {
    model: models.PreconBuilder,
    attributes: ['id'],
    as: 'PB',
    include: {
      model: models.Builder,
      attributes: ['name', 'web_id'],
      as: 'Builder'
    }
  };

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

  this.include.MainHood =
  {
    model: models.MainHood,
    attributes: ['id', 'web_id', 'name']
  };

};

/**
 * after filtering add the array to sqlObj
 */
Project.prototype.startWhere = function () {
  // pass this.where by reference and fill it up later with array of where clauses
  this.sqlObj.where = Sequelize.and(this.where);
};

// filters

Project.prototype._filter_num = function (val) {
  if (__.isInt(val)) {
    this.limit = Math.min(val, Project.maxLimit);
  }
};

Project.prototype._filter_offset = function (val) {
  if (__.isInt(val) && val > 0) {
    this.offset = val;
  }
};

Project.prototype._filter_page = function (val) {
  if (__.isInt(val) && val > 0) {
    this.page = val;
  }
};

Project.prototype._filter_bounds = function (val) {
  if (!val) {
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


Project.prototype._filter_ids = function (val) {
  if (!val) {
    return;
  }
  var idsAr = val.split(',');
  this.where.push({id: idsAr});
};

Project.prototype._filter_order_by = function (val) {
  if (val) {
    var paramsAr = [val.split(',')];
    if(paramsAr[0] == 'id' || paramsAr[0] == 'created_on' || paramsAr[0] == 'updated_on') {
      this.sqlObj.order = paramsAr;
    }
  }
};

Project.prototype._filter_assets_exact = function(val) {
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

  this.where.push(["ResourceTemps.entity_type='project'"]);

  // // count how many images are associated to each precon id 
  this.sqlObj.having = ['COUNT(?) >= ?', 'ResourceTemps.path', this.assetsNum];
  this.sqlObj.group = ['PreconUnit.id','ResourceTemps.entity_id'];
}

Project.prototype._filter_beds = function (val) {
  if (val === 'all' || val === '' || val === undefined) {
    return;
  }

  var pattern = /^([\d]+)(-plus)?$/i;
  var match = pattern.exec(val);
  if (match === null) {
    return;
  }
  if (!__.isInt(match[1])) {
    return;
  }

  var clause = [];

  if (match[2] !== undefined) {
    if (this.isExact === false) {
      //clause = ['(PreconUnit.num_beds >= ? or PreconUnit.num_beds is null)', match[1]];
      this.include.PreconUnit.where = Sequelize.and(this.include.PreconUnit.where, Sequelize.or(
        {num_beds: {gte: match[1]}},
        {num_beds: null}
      ));
    } else {
      this.include.PreconUnit.where.num_beds = {gte: match[1]};
      //clause = ['PreconUnit.num_beds >= ?', match[1]];
    }
  } else {
    if (this.isExact === false) {
      this.include.PreconUnit.where = Sequelize.and(this.include.PreconUnit.where, Sequelize.or(
        {num_beds: match[1]},
        {num_beds: null}
      ));
      //clause = ['(PreconUnit.num_beds = ? or PreconUnit.num_beds is null)', match[1]];
    } else {
      this.include.PreconUnit.where.num_beds = match[1];
      //clause = ['PreconUnit.num_beds = ?', match[1]];
    }
  }

  //this.where.push(clause);

};

Project.prototype._filter_baths = function (val) {
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

  var clause = [];

  if (match[2] !== undefined) {
    if (this.isExact === false) {
      //clause = ['(PreconUnit.num_baths >= ? or PreconUnit.num_baths is null)', match[1]];
      this.include.PreconUnit.where = Sequelize.and(this.include.PreconUnit.where, Sequelize.or(
        {num_baths: {gte: match[1]}},
        {num_baths: null}
      ));
    } else {
      //clause = ['PreconUnit.num_baths >= ?', match[1]];
      this.include.PreconUnit.where.num_baths = {gte: match[1]};
    }
  } else {
    if (this.isExact === false) {
      //clause = ['(PreconUnit.num_baths = ? or PreconUnit.num_baths is null)', match[1]];
      this.include.PreconUnit.where = Sequelize.and(this.include.PreconUnit.where, Sequelize.or(
        {num_baths: match[1]},
        {num_baths: null}
      ));
    } else {
      //clause = ['PreconUnit.num_baths = ?', match[1]];
      this.include.PreconUnit.where.num_baths = match[1];
    }
  }

  //this.where.push(clause);

};

Project.prototype._filter_vip = function (val) {
  if (typeof val === 'undefined' || val == 0) {
    return;
  }

  this.where.push({ is_vip_active: true });
};

Project.prototype._filter_min_price = function (val) {
  if (!__.isInt(val)) {
    return;
  }

//  this.include.PreconUnit = { model: models.PreconUnit };

  var clause = ['`Precon`.`price_max` >= ' + val + ' AND '
      + '(`PreconUnit`.`price` ' + ' >= ' + val + ' OR `PreconUnit`.`price` is null)'];

  this.where.push(clause);
};

Project.prototype._filter_max_price = function (val) {
  if (!__.isInt(val)) {
    return;
  }
  var clause = ['`Precon`.`price_min` <= ' + val + ' AND '
    + '(`PreconUnit`.`price` ' + ' <= ' + val + ' OR `PreconUnit`.`price` is null)'];

  this.where.push(clause);
};

Project.prototype._filter_province = function (val) {

  if (__.isInt(val)) {
    this.where.push({province_id: val});
  }

  if (!_.has(this.include, 'MainProvince')) {
    var attributes = (this.responseLevel == 'simple' ? [] : ['id']);
    this.include.MainProvince =
    {
      model: models.MainProvince,
      attributes: ['id', 'web_id', 'name']
    };
  }
};

Project.prototype._filter_region = function (val) {
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


Project.prototype._filter_city = function (val) {
  if (!val) {
    return;
  }
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
      required: false,
      attributes: ['id', 'web_id', 'name']
    };
  }
};

Project.prototype._filter_hood = function (val) {
  if (!val) {
    return;
  }
  if (_.isArray(val)) {
    val = val.toString();
  }
  var hoodAr = val.split(',');
  this.where.push({hood_id: hoodAr});

  if (!_.has(this.include, 'MainHood')) {
    var attributes = (this.responseLevel == 'simple' ? [] : ['id']);
    this.include.MainHood = {
      model: models.MainHood,
      required: false,
      attributes: ['id', 'web_id', 'name']
    };
  }
};

Project.prototype._filter_match = function (val) {
  if (!val) {
    return;
  }
  val = decodeURI(val);
  this.sqlObj.order = '';
  var param = val;
  this.where.push(['match(Precon.name, Precon.addr_street) against(?)', param]);
};

Project.prototype._filter_occupancy = function (val) {
  if (!val || !__.isInt(val)) {
    return;
  }

  var clause = [];
  if (this.isExact === false) {
    clause = ['(Precon.occupancy_year = ? or Precon.occupancy_year = 0 or Precon.occupancy_year is null)', val];
  } else {
    clause = ['Precon.occupancy_year = ?', val];
  }

  this.where.push(clause);
};

Project.prototype._filter_amenities = function (val) {
  if(!val) {
    return;
  }

  var params = val.split(',');
  var self = this;
  _.each(params, function (element, index, list) {
		self.include['PreconPreconAmenity' + index] = {
			model: models.PreconPreconAmenity,
			attributes: ['id'],
			required: true,
			as: 'PPA' + index,
			include: {
				model: models.PreconAmenity,
				attributes: ['name', 'description'],
				as: 'PA',
				required: true,
				where: ['`PPA' + index + '.PA`.`name` REGEXP "' + element + '"']
			}
		};
  });
};

Project.prototype._filter_builder = function (val) {
  if(!val){
    return;
  }
  this.include.PreconBuilder = {
        model: models.PreconBuilder,
        attributes: ['id'],
        as: 'PB',
        include: {
            model: models.Builder,
            attributes: ['name', 'web_id'],
            as: 'Builder',
            where: ['`PB.Builder`.`web_id` like "%'+ __.convertToWebId(val) +'%"']
        }
    };
};

Project.prototype._filter_name = function (val) {
  if(!val){
    return;
  }
  val = __.convertToWebId(val);
  var clause = ['Precon.web_id = ?', val];
  this.where.push(clause);
};



// attributes
Project.prototype._attr_simple = function () {
  this.sqlObj.attributes = ['id', 'lat', 'lng', 'price_min', 'is_vip_active'];
  this.sqlObj.distinct = 'Precon.id'; // for count only
};

Project.prototype._attr_summary = function () {
  this.sqlObj.attributes = ['id', 'name', 'price_min', 'num_units',
                            'num_floors', 'is_vip_active', 'addr_city', 'addr_street', 'description'];
  this.sqlObj.distinct = 'Precon.id'; // for count onlys

};

Project.prototype._attr_listview = function () {
  this.sqlObj.attributes = ['id', 'name', 'price_min', 'price_max', 'num_units',
    'num_floors', 'is_vip_active', 'addr_city', 'addr_street', 'addr_province', 'description', 'lat', 'lng', 'maintenance_per_sqft',
    'occupancy_year'];
  this.sqlObj.distinct = 'Precon.id'; // for count onlys

};

Project.prototype._attr_autocomplete = function () {
  this.sqlObj.attributes = ['id', 'name', 'addr_street', 'addr_city', 'is_vip_active'];
  this.sqlObj.distinct = 'Precon.id';
};

Project.prototype._attr_full = function () {

};

Project.prototype.getIncludesAr = function() {
  var ar = [];

  var self = this;
  _.each(this.include, function(inc){
    ar.push(inc.as);
    if (_.has(inc, 'include') && _.has(inc.include, 'as')) {
      ar.push(inc.include.as);
    }
  });

  return ar;
};

Project.prototype.addWhereLevel = function() {
  var includes = this.getIncludesAr();
  var includesRegex = new RegExp('('+includes.join("|")+')', 'g');

  var whereArgs = this.sqlObj.where.args[0];
  for (var i in whereArgs) {
    if (_.isObject(whereArgs[i])) {
      for (var j in whereArgs[i]) {
        if (_.isObject(whereArgs[i][j])){
          continue;
        } else {
          whereArgs[i][j] = whereArgs[i][j].replace(includesRegex, "`Precon.$1`");
          whereArgs[i][j] = whereArgs[i][j].replace(/``/g, '`');
        }
      }
    } else if (_.isArray(whereArgs[i])) {
      for (var j in whereArgs[i]) {
        whereArgs[i][j] = whereArgs[i][j].replace(includesRegex, "`Precon.$1`");
        whereArgs[i][j] = whereArgs[i][j].replace(/``/g,'`');
      }
    } else {
      whereArgs[i] = whereArgs[i].replace(includesRegex, "`Precon.$1`");
      whereArgs[i] = whereArgs[i].replace(/``/g,'`');
    }
  }

  return whereArgs;
};

Project.prototype.addIncludeWhereLevel = function() {
  var self = this;
  var includeObj = _.clone(this.sqlObj.include);
  _.each(_.keys(includeObj), function(key){
    if (_.has(includeObj[key], 'include') && _.has(includeObj[key].include, 'where')) {
      var reg = new RegExp('('+ includeObj[key].as +'.'+ includeObj[key].include.as +')', 'g');

      if (_.isObject(includeObj[key].include.where)) {
        for (var j in includeObj[key].include.where) {
          if (_.isObject(includeObj[key].include.where[j])){
            continue;
          } else {
            includeObj[key].include.where[j] = includeObj[key].include.where[j].replace(reg, "Precon.$1");
          }
        }
      } else if (_.isArray(includeObj[key].include.where)) {
        for (var j in includeObj[key].include.where) {
          includeObj[key].include.where[j] = includeObj[key].include.where[j].replace(reg, "Precon.$1");
        }
      } else {
        includeObj[key].include.where = includeObj[key].include.where.replace(reg, "Precon.$1");
      }
    }
  });

  return includeObj;
};