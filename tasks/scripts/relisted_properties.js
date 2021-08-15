require(__dirname + '/../../initializer');
var fs = require('fs');
var when = require('when');
var moment = require('moment');
var csv = require('csv-write-stream');
var writer = csv({ headers: ['Address', 'Beds', 'Baths', 'DOM', 'Region', 'City', 'Hood',
                             'Property Type', 'Original Price', 'Relisted Price', 'Time Diff']});

exports = module.exports = function (options, callback) {
    models.Property.findAll({
    attributes: ['addr_full_slug'],
    where: {
      listing_type_id: 1,
      addr_full_slug: {ne: null},
      addr_full_slug: {ne: ''},
      created_on: {between: [options.fromDate, options.toDate]}
    },
    group: ['addr_full_slug'],
    having: ['COUNT(*) > ?',  1]
  }).then(function (relistedProperties) {
    var promise = [];
    writer.pipe(fs.createWriteStream('/tmp/rp-'+ options.fromDate + '-' + options.toDate +'.csv'));
    _.each(relistedProperties, function (relistedProperty, key) {
      promise[key] = models.Property.findAll({
        attributes: ['addr_full','num_beds', 'num_baths', 'dom', 'MainRegion.name', 'addr_city', 'addr_hood', 'PropertyTrpType.name', 'price', 'created_on', 'property_status_id' ],
        where: {
          addr_full_slug: relistedProperty.addr_full_slug,
          created_on: {between: [options.fromDate, options.toDate]}
        },
        include: [
          {model: models.MainRegion},
          {model: models.PropertyTrpType}
        ],
        order: [['created_on', 'asc']],
        limit: 2
      }).then(function (properties) {
        if (properties[0].property_status_id == 1 && properties[1].property_status_id == 1) {
          return;
        }
        var dateDiff = new moment.duration(Math.abs(properties[1].created_on - properties[0].created_on));
        writer.write([properties[0].addr_full,
                      properties[0].num_beds,
                      properties[0].num_baths,
                      properties[0].dom,
                      (properties[0].MainRegion) ? properties[0].MainRegion.name : 'N/A',
                      properties[0].addr_city,
                      properties[0].addr_hood,
                      (properties[0].PropertyTrpType) ? properties[0].PropertyTrpType.name : 'N/A',
                      properties[0].price,
                      properties[1].price,
                      dateDiff.asDays()]);
        return;
      });
    });
    return when.all(promise).then(function (promise) {
      callback('It\'s been done! '+ promise.length + ' re-listed found');
    });
  }).catch(function (err) {
     throw err;
  });
};

