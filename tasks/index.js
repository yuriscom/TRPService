var readline = require('readline')
  , readlineInterface = readline.createInterface(
    process.stdin,
    process.stdout,
    null
  )
  ;


readlineInterface.setPrompt('TheRedPin Application Server > ');


readlineInterface.on('line', function (command) {
  var environments, environment, options;
  switch (command) {

    case 'q':
    case 'quit':
    case 'exit':
      readlineInterface.question('Are you sure? (Y/n) ', function (answer) {
        if (answer === 'y' || answer === '') {
          readlineInterface.close();
        } else {
          readlineInterface.prompt();
        }
      });
      break;

    case 'gm':
    case 'generate models':

      environments = require(PATH + '/configuration/environments.json');
      environment = environments[ process.env.NODE_ENV || 'production' ];
      options = _.extend({ path: PATH + '/models' }, environment.database);

      console.log('This will create or overwrite models in ' + options.path + ', ' +
        'based on ' + options.database + 'database, hosted on ' + options.host);

      readlineInterface.question('Are you sure? (Y/n) ', function (answer) {
        if (answer === 'y' || answer === '') {
          require('./generators/models.js')(options, function () {
            readlineInterface.prompt();
          });
        } else {
          readlineInterface.prompt();
        }
      });
      break;

    case 'gp':
    case 'generate polygons':

      require('./generators/polygons.js')(function () {
        readlineInterface.prompt();
      });

      break;

    case 'num_floorplans':
      environments = require(PATH + '/configuration/environments.json');
      environment = environments[ process.env.NODE_ENV || 'production' ];
      options = _.extend({ path: PATH + '/models' }, environment.database);

      console.log('This will populate or overwrite num_floorplans in precon table ' +
        'based on the real number of units');

      readlineInterface.question('Are you sure? (y/n) ', function (answer) {
        if (answer === 'y' || answer === '') {
          require('./scripts/update_precon_num_floorplans.js')(options, function () {
            //readlineInterface.prompt();
          });
        } else {
          readlineInterface.prompt();
        }
      });
      break;

    case 'gen_agents_resources':
      environments = require(PATH + '/configuration/environments.json');
      environment = environments[ process.env.NODE_ENV || 'production' ];
      options = _.extend({ path: PATH + '/models' }, environment.database);

      console.log('This will create or overwrite resources in the resource table ');

      readlineInterface.question('Are you sure? (y/n) ', function (answer) {
        if (answer === 'y' || answer === '') {
          require('./scripts/populate_resource_table.js')(options, function () {
            readlineInterface.prompt();
          });
        } else {
          readlineInterface.prompt();
        }
      });
      break;

    case "ss_migrate":
      environments = require(PATH + '/configuration/environments.json');
      environment = environments[ process.env.NODE_ENV || 'production' ];
      options = _.extend({ path: PATH + '/models' }, environment.database);
      console.log('This will migrate data from old saved_search table to saved_search_property ');

      readlineInterface.question('Are you sure? (y/n) ', function (answer) {
        if (answer === 'y' || answer === '') {
          require('./scripts/saved_search_migrate.js')(options, function () {
            readlineInterface.prompt();
          });
        } else {
          readlineInterface.prompt();
        }
      });

      break;

    case 'hub_data':
      environments = require(PATH + '/configuration/environments.json');
      environment = environments[ process.env.NODE_ENV || 'production' ];
      options = _.extend({ path: PATH + '/models' }, environment.database);

      console.log('This will populate description and extra of the new location tables');

      readlineInterface.question('Are you sure? (y/n) ', function (answer) {
        if (answer === 'y' || answer === '') {
          require('./scripts/update_main_locations_data.js')(options, function () {
            readlineInterface.prompt();
          });
        } else {
          readlineInterface.prompt();
        }
      });
      break;
    case 'reverse_ss':
      environments = require(PATH + '/configuration/environments.json');
      environment = environments[ process.env.NODE_ENV || 'production' ];
      options = _.extend({ path: PATH + '/models' }, environment);

      console.log('This will determine what saved searches match your listing.');

      readlineInterface.question('Listing Type (exclusive): ', function (type) {
        if(type === 'exclusive' || type === '') {
          options.type = (type) ? type : 'exclusive';
          readlineInterface.question('Listing id: ', function (id) {
            options.listing_id = id;
            if (__.isInt(id)) {
                require('./scripts/reverse_saved_search.js')(options, function (response) {
                  console.log('Executing... This operation may take a couple of minutes');
                  readlineInterface.write(response);
              });
            } else {
              readlineInterface.prompt();
            }
          });
        }else{
          readlineInterface.prompt();
        }
      });
      break;
    case 'relisted_properties':
      environments = require(PATH + '/configuration/environments.json');
      environment = environments[ process.env.NODE_ENV || 'production' ];
      options = _.extend({ path: PATH + '/models' }, environment.database);
      readlineInterface.question('From (yyyy-mm-dd): ', function (fromDate) {
        if(!fromDate) {
          console.log('bad input');
          readlineInterface.prompt();
        }
        options.fromDate = fromDate;
        readlineInterface.question('To (yyyy-mm-dd): ', function (toDate) {
          if(!toDate) {
            console.log('bad input');
            readlineInterface.prompt();
          }
          options.toDate = toDate;
          require('./scripts/relisted_properties.js')(options, function (response) {
            console.log('Executing... This operation may take a couple of minutes');
            readlineInterface.write(response);
          });
        });
      });

      break;
    default:
      console.log('Unknown command!');
  }

  readlineInterface.prompt();
});


readlineInterface.on('close', function () {
  console.log('Exit TheRedPin Application Server');
  //process.exit();
});


readlineInterface.prompt();
