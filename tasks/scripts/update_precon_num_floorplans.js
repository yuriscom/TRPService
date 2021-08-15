var Sequelize = require('../../lib/sequelize')
  ;


exports = module.exports = function (options, callback) {

  var sequelize = new Sequelize(
      options.database,
      options.username,
      options.password,
      options
    ),
    query = 'update precon, '
      + '(select precon.id, count(precon_unit.id) as cnt '
      + 'from precon left join precon_unit on precon.id=precon_unit.precon_id '
      + 'group by precon.id order by cnt) src set precon.num_floorplans=src.cnt '
      + 'where precon.id = src.id';

  sequelize.query(query).then(function () {
    console.log('done.');
  });

};