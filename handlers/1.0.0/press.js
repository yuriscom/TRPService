function Press () {
}

Press.prototype.version = '1.0.0';

Press.prototype.getAll = function (params) {
  var query = {};
  query.order = [['published_on', 'desc']];
  if (params.order_by) {
    var orderAr = params.order_by.split(',');
    if(orderAr.length < 2) {
      throw 'Bad param order by: ' + params.order_by;
    }
    query.order = [orderAr];
  }
  return models.Press.findAll(query).then(function (results) {
    return results;
  }).catch(function (err) {
    throw err;
  });
};

exports = module.exports = Press;