/*
models.MainCity.afterFind(function (result, options) {
    function process(key, value) {
      if (_.has(value, 'type') && _.has(value, 'coordinates') && value.type == 'Polygon') {
        console.log(key);
      }
    }

    function traverse(source, func) {
      if (!_.has(source, "dataValues")) {
        return;
      }
      var o = source.dataValues;

      for (var i in o) {
        if (o[i] !== null) {
          if (typeof(o[i]) == "object") {
            if (_.has(o[i], "dataValues")) {
              traverse(o[i], func);
            } else {
              func.apply(this, [i, o[i]]);
            }
          } else {
            func.apply(this, [i, o[i]]);
          }
        }
      }
    }

    traverse(result, process);
  }
)
;
*/
