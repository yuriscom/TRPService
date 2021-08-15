function Response (result) {
  this.result = result;
  this.fields = [];
  this.firstArray = true;
}

exports = module.exports = Response;

Response.prototype.generate = function () {
  return {code: 'ok', result: this.result};
};

Response.prototype.compact = function () {
  this.result = this.getFormatted(this.result);
  //this.getFormatted(this.result);
};


Response.prototype.getFormatted = function (result, fields, map, depth) {
  depth = depth || 1;

  if (result === undefined) {
    if (depth == 1) {
      result = this.result;
    }
  }

  if (fields === undefined) {
    fields = this.fields;
  }

  if (map === undefined) {
    map = false;
  }

  if (_.isArray(result)) {
    resultsAr = [];

    var addFields = false;
    var firstArray = this.firstArray;
    if (this.firstArray === true) {
      this.firstArray = false;
      addFields = true;
    }

    var insideArrayFunc = function (el) {
      resultsAr.push(this.getFormatted(el, fields, true, ++depth));
    };
    insideArrayFunc = _.bind(insideArrayFunc, this);
    result.forEach(insideArrayFunc);

    if (addFields === true) {
      resultsAr.unshift(this.fields);
    }

    this.firstArray = firstArray;

    return resultsAr;
  } else if (_.isObject(result)) {
    if (typeof result.toJSON === 'function') {
      result = result.toJSON();
    }

    if (map) {
      var keys = _.keys(result);
      if (this.isEmpty(fields)) {
        this.fields = keys;
      }

      var resultsAr = [];

      var insideObjectMapFunc = function (field) {
        var fieldsBackup = this.fields;
        this.fields = [];

        var addArray = false;
        var isMultiArray = false;
        if (_.isArray(result[field])) {
          _.each(result[field], function(element){
            if(_.isArray(element)){
             isMultiArray = true;
            }
          });
          addArray = true;
        }

        resultsAr.push(this.getFormatted(result[field], this.fields, map, ++depth));
        if (!this.isEmpty(this.fields)) {
          for (var idx in fieldsBackup) {
            if (fieldsBackup[idx] == field) {
              fieldsBackup[idx] = {};
              if (addArray === false) {
                fieldsBackup[idx][field] = this.fields;
              } else {
                if(isMultiArray === true){
                  fieldsBackup[idx][field] = [[this.fields]];
                }else{
                  fieldsBackup[idx][field] = [this.fields];
                }

              }
              break;
            }
          }

        }
        this.fields = fieldsBackup;
      };

      insideObjectMapFunc = _.bind(insideObjectMapFunc, this);

      keys.forEach(insideObjectMapFunc);

      return resultsAr;
    } else {
      var resultsObj = {};
      var insideObjectSimpleFunc = function (field) {
        resultsObj[field] = this.getFormatted(result[field], fields, map, ++depth);
      };
      insideObjectSimpleFunc = _.bind(insideObjectSimpleFunc, this);
      _.keys(result).forEach(insideObjectSimpleFunc);
      return resultsObj;
    }
  } else {
    return result;
  }
};


Response.prototype.isEmpty = function (el) {
  if (_.isArray(el)) {
    return (el.length === 0);
  } else if (_.isObject(el)) {
    return _.isEmpty(el);
  } else {
    return true;
  }
};
