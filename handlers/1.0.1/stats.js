var when = require('when');

function Stats () {
}

Stats.prototype.version = '1.0.1';

Stats.prototype.getHistoricalAveragePrice = function (params) {
  var self = this;
  var Search = require(PATH + '/lib/search/property');
  var search = new Search();
  var sqlObj = search.getSqlObj(params, 'simple');
  sqlObj.attributes = [
    [sequelize.fn('count', sequelize.col('Property.id')), 'count'],
    [sequelize.fn('avg', sequelize.col('Property.price')), 'avgPrice'],
    [sequelize.literal('EXTRACT(YEAR_MONTH FROM `Property`.`created_on`)'), 'createdYearMonth']
  ];

  var locationModel = setLocationModel(params);

  var d = new Date();
  var numMonths = parseFloat(params.months) || 12;
  var earliestCreatedOn = new Date(d.setMonth(d.getMonth() - numMonths));
  sqlObj.where.args[0].push({
    created_on: {
      gte: earliestCreatedOn
    }
  });

  sqlObj.group = ['createdYearMonth', 'PropertyTrpType.id'];
  if (locationModel) {
    sqlObj.group.unshift(locationModel + '.id');
  }
  delete sqlObj.limit;
  delete sqlObj.order;

  return models.Property.findAll(sqlObj).then(function (result){
    var resultJSON = result.map(function (obj) {
      return obj.toJSON();
    });
    var pricingDataHash = {};
    resultJSON.forEach(function (priceAverageObj) {
      var locationModelObj = priceAverageObj[locationModel] || { id: params.metro };
      var reducedDataObj = _.omit(priceAverageObj, locationModel);
      if (pricingDataHash[locationModelObj.id]) {
        existingHashObj = pricingDataHash[locationModelObj.id];
        existingHashObj.data[priceAverageObj.createdYearMonth] = existingHashObj.data[priceAverageObj.createdYearMonth] || [];
        existingHashObj.data[priceAverageObj.createdYearMonth].push(reducedDataObj);
      } else {
        locationModelObj.data = {};
        locationModelObj.data[priceAverageObj.createdYearMonth] = [reducedDataObj];
        pricingDataHash[locationModelObj.id] = locationModelObj;
      }
    });

    return pricingDataHash;
  });
}

Stats.prototype.getAveragePrice = function (params) {
  var self = this;
  var Search = require(PATH + '/lib/search/property');
  var search = new Search();
  var sqlObj = search.getSqlObj(params, 'simple');
  sqlObj.attributes = [
    [sequelize.fn('count', sequelize.col('Property.id')), 'count'],
    [sequelize.fn('avg', sequelize.col('Property.price')), 'avgPrice']
  ];

  var locationModel = setLocationModel(params);

  sqlObj.group = ['PropertyTrpType.id'];
  if (locationModel) {
    sqlObj.group.unshift(locationModel + '.id');
  }
  delete sqlObj.limit;
  delete sqlObj.order;

  return models.Property.findAll(sqlObj).then(function (result){
    var resultJSON = result.map(function (obj) {
      return obj.toJSON();
    });
    var pricingDataHash = {};
    resultJSON.forEach(function (priceAverageObj) {
      var locationModelObj = priceAverageObj[locationModel] || { id: params.metro };
      var reducedDataObj = _.omit(priceAverageObj, locationModel);
      if (pricingDataHash[locationModelObj.id]) {
        existingHashObj = pricingDataHash[locationModelObj.id];
        existingHashObj.data.push(reducedDataObj);
      } else {
        locationModelObj.data = [reducedDataObj];
        pricingDataHash[locationModelObj.id] = locationModelObj;
      }
    });

    return pricingDataHash;
  });
}

function setLocationModel(params) {
  if (params.hood) {
    return 'MainHood';
  } else if (params.city) {
    return 'MainCity';
  } else if (params.region) {
    return 'MainRegion';
  } else if (params.province) {
    return 'MainProvince';
  } else {
    return null;
  }
};

exports = module.exports = Stats;