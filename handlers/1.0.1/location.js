var when = require('when');

function Location () {
}

Location.prototype.version = '1.0.1';

Location.prototype.getByPoint = function (options) {
  try {
    options = JSON.parse(options);
  } catch (e) {
    return null;
  }

  var model = null
      , attributes = ['id', 'polygon']
      , or = []
      , where = null
      , levelLabel = null;

  _.each(options.name.split(' '), function (val) {
    or.push({name: {like: "%" + val + "%"}});
  });

  where = Sequelize.and(
    sequelize.fn('st_contains', sequelize.col('polygon'), sequelize.fn('geomfromtext', 'POINT(' + options.lng + ' ' + options.lat + ')')),
    Sequelize.or.apply(this, or)
  );

  if (options.type === 'neighborhood') {
    model = models.MainHood;
    levelLabel = 'hood';
  } else if (options.type === 'locality') {
    model = models.MainCity;
    levelLabel = 'city';
  } else if(options.type.match(/^administrative_area/)){
    model = models.MainRegion;
    levelLabel = 'region';
  }

  if (model) {
    var promise = when.promise(function (resolve, reject, notify) {
      model.find(
        {
          attributes: attributes,
          where: where
        }
      ).then(function (result) {
        if (result !== null) {
          result.addField('poly_id', result.dataValues.id + "," + levelLabel);
        }
        resolve(result);
      });
    });
    return promise;
  } else {
    throw 'no appropriate hierarchical level found for location';
  }
};

Location.prototype.getByKey = function (key) {
  var model = null
      , attributes = ['polygon', [sequelize.fn('envelope', sequelize.col('polygon')), 'envelope']]
      , or = []
      , where = null
      , levelLabel = null;

  polyID = key.split(',');
  where = { id: polyID[0] };

  if (polyID[1] === 'hood') {
    model = models.MainHood;
  } else if (polyID[1] === 'city') {
    model = models.MainCity;
  } else if (polyID[1] === 'region') {
    model = models.MainRegion;
  }

  if (model) {
    var promise = when.promise(function (resolve, reject, notify) {
      model.find(
        {
          attributes: attributes,
          where: where
        }
      ).then(function (result) {
        if (result !== null) {
          result.addField('poly_id', key);
          result.addField('coords', __.getCoordsFromEnvelope(result.dataValues.envelope));
          result.deleteField('envelope');
        }
        resolve(result);
      });
    });
    return promise;
  } else {
    throw 'no appropriate hierarchical level found for location';
  }
}

exports = module.exports = Location;