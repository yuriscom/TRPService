var http = require('http');
var when = require('when');

function Page () {
}

Page.prototype.version = '1.0.1';

Page.prototype.search = function(params) {
  if (params.uri === undefined) {
    throw 'Page handler can search by uri only';
  }

  //var uri = decodeURI(params.uri);
  return models.Page.find({
    where: {uri: params.uri}
  });
};

exports = module.exports = Page;