var Sequelize = require('../../lib/sequelize')
  ;

exports = module.exports = function (options, callback) {

  var sequelize = new Sequelize(
      options.database,
      options.username,
      options.password,
      options
    ),
  hoodsQuery = 'select id, web_id, description, extra from hood where description is not null and extra is not null';

  sequelize.query(hoodsQuery).then(function (results) {
    _.each(results, function(result){
      var updateQuery;
      if(result.web_id === 'bloor-west-village'){
        updateQuery = 'update main_hood set description = "'+result.description+'", '
                      + 'extra = "'+result.extra+'" where id = 968;';
      }else{
        updateQuery = 'update main_hood set description = "'+result.description+'", '
                      + 'extra = "'+result.extra+'" where web_id = "'+result.web_id+'" and city_id = 1072;';
      }

      sequelize.query(updateQuery);
    });

    console.log('Done Hoods.');
  });

  var citiesQuery = 'select id, web_id, description, extra from city '
                    + 'where description is not null and extra is not null';

  sequelize.query(citiesQuery).then(function (results) {
    _.each(results, function(result){
      var updateQuery = 'update main_city set description = "'+result.description+'", '
                        + 'extra = "'+result.extra+'" where web_id = "'+result.web_id+'";';

      sequelize.query(updateQuery);
    });

    console.log('Done Cities.');
  });


};