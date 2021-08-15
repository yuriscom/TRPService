require(__dirname + '/../../initializer');
var fs = require('fs');
var when = require('when');
var csv = require('csv-write-stream');
var writer = csv({ headers: ['Email']});

exports = module.exports = function (options, callback) {
  var SavedSearch = new handlers['1.0.0']['saved-search']();
  var date = new Date();
  writer.pipe(fs.createWriteStream('/tmp/rss-'+ options.type + '-' + options.listing_id + '-'
                                   + date.getFullYear() + '-' + (date.getMonth() + 1) + '-'
                                   + date.getDate() + '.csv'));
  SavedSearch.getByListingId(options.listing_id, options.type).then(function (results) {
    when.map(results, function (result) {
      writer.write([result]);
      return;
    }).then(function () {
      callback('it\'s been done....');
    });
  }).catch(function (err) {
    throw err;
  });
};