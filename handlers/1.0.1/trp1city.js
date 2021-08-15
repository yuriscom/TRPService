var http = require('http')
  , when = require('when')
  , Geometry = require(PATH + '/lib/geometry');

function Trp1City () {
}

Trp1City.prototype.version = '1.0.1';

Trp1City.prototype.getByWebId = function (slug, province) {
  return models.City.find({
    where: { web_id: slug },
    attributes: ['id', 'name', 'web_id', 'bounds']
  });
};

exports = module.exports = Trp1City;