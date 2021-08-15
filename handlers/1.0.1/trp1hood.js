var http = require('http')
  , when = require('when')
  , Geometry = require(PATH + '/lib/geometry');

function Trp1Hood () {
}

Trp1Hood.prototype.version = '1.0.1';

Trp1Hood.prototype.getByWebId = function (slug, province) {
  return models.Hood.find({
    where: { web_id: slug },
    attributes: ['id', 'name', 'web_id', 'bounds']
  });
};

exports = module.exports = Trp1Hood;