var Sequelize = require('../../lib/sequelize')
  , async = require('async')
  , fs = require('fs')
  ;


exports = module.exports = function (options, callback) {


  var sequelize = new Sequelize(
      options.database,
      options.username,
      options.password,
      options
    )
    , queryInterface = sequelize.getQueryInterface()
    , tables = {}
    , keys = {}
    , index = ''
    , spaces = ''
    ;


  // set the indentation
  options.indentation = 2;
  options.spaces = true;
  for (var x = 0; x < options.indentation; ++x) {
    spaces += (options.spaces === true ? ' ' : '\t');
  }


  console.log('Scanning database...');


  sequelize
    .query(queryInterface.QueryGenerator.showTablesQuery(), null, { raw: true })
    .done(function (error, results) {

      if (error) {
        throw error;
      }

      var _tables = {};

      async.each(
        results,

        // run this function asyncronously
        function (table, _callback) {
          var tableName = Array.isArray(table) ? table[0] : table;

          queryInterface.describeTable(tableName)
            .done(function (error, results) {
              _tables[tableName] = results;

              var primaryKeyPattern
                , uniqueKeyPattern
                , foreignKeyPattern
                ;
              // jscs: disable
              // jshint ignore: start
              primaryKeyPattern = /primary key \(([`',A-Za-z0-9-_]+)\)/ig;
              uniqueKeyPattern = /unique key [`']?([A-Za-z0-9-_]+)[`']? \(([`',A-Za-z0-9-_]+)\)/ig;
              foreignKeyPattern = /constraint [`']?([A-Za-z0-9-_]+)[`']? foreign key \([`']?([A-Za-z0-9-_]+)[`']?\) references [`']?([A-Za-z0-9-_]+)[`']? \([`']?([A-Za-z0-9-_]+)[`']?\)/ig;
              // jshint ignore: end
              // jscs: enable

              sequelize.query(
                  'SHOW CREATE TABLE `' + tableName + '`;'
                ).done(function (error, results) {
                  keys[tableName] = {};

                  var createStatement = results[0]['Create Table'];

                  var primaryKeys = createStatement.match(primaryKeyPattern);
                  if (primaryKeys) {
                    primaryKeys = _.map(primaryKeys, function (statement) {
                      statement = statement.replace(primaryKeyPattern, '$1');
                      statement = statement.replace(/[`']/g, '');
                      statement = statement.split(',');
                      return statement;
                    });

                    keys[tableName].primaryKeys = primaryKeys[0];
                  }

                  var uniqueKeys = createStatement.match(uniqueKeyPattern);
                  if (uniqueKeys) {
                    uniqueKeys = _.map(uniqueKeys, function (statement) {
                      var uniqueKey = {}
                        , key = statement.replace(uniqueKeyPattern, '$1')
                        ;
                      statement = statement.replace(uniqueKeyPattern, '$2');
                      statement = statement.replace(/[`']/g, '');
                      statement = statement.split(',');
                      uniqueKey[key] = statement;
                      return uniqueKey;
                    });

                    keys[tableName].uniqueKeys = uniqueKeys;
                  }

                  var foreignKeys = createStatement.match(foreignKeyPattern);
                  if (foreignKeys) {
                    foreignKeys = _.map(foreignKeys, function (statement) {
                      var foreignKey = {}
                        , key = statement.replace(foreignKeyPattern, '$2')
                        , foreignTable = statement.replace(foreignKeyPattern, '$3')
                        , foreignField = statement.replace(foreignKeyPattern, '$4')
                        ;
                      foreignKey[key] = {
                        table: foreignTable,
                        field: foreignField
                      };
                      return foreignKey;
                    });

                    keys[tableName].foreignKeys = foreignKeys;
                  }

                  _callback(null);
                });
            });

        },

        // after all
        function () {
          index += 'var fs = require(\'fs\');\n\n';
          // start the index file content
          index += 'exports = module.exports = function (sequelize) {\n' +
            spaces + 'var models = {};\n\n';

          var tableNames = Object.keys(_tables);

          async.each(
            tableNames,

            // run this function asyncronously
            function (table, _callback) {
              var fields = Object.keys(_tables[table]);

              // append to index file content
              var dTable = _.dasherize(table);
              index += spaces + 'models.' + _.capitalize(_.camelize(table)) + ' = ' +
                '(fs.existsSync(PATH + \'/' + _.last(options.path.split('/')) + '/' + dTable + '.js\')) ? ' +
                'require(PATH + \'/' + _.last(options.path.split('/')) +
                '/' + dTable + '\')(sequelize) : ' +
                'sequelize.import(PATH + \'/' + _.last(options.path.split('/')) +
                '/base/' + dTable + '\'); ' +
                '\n'
              ;

              // start the model file content
              tables[table] = 'module.exports = function(sequelize, DataTypes) {\n' +
                spaces + 'return sequelize.define(\'' +
                _.capitalize(_.camelize(table)) + '\', {\n';

              var tableHasPK = false;
              for (var i in fields) {
                var field = fields[i];
                if (_.contains(keys[table].primaryKeys, field)) {
                  tableHasPK = true;
                  break;
                }
              }
              var tableHasIdField = fields.indexOf("id") > -1;


              fields.forEach(function (field, i) {

                tables[table] += spaces + spaces + field + ': {\n';
                //tables[table] += spaces + spaces + spaces + 'field: \'' + field + '\',\n';

                // check if the field is a primary key
                if (tableHasPK) {
                  if (_.contains(keys[table].primaryKeys, field)) {
                    tables[table] += spaces + spaces + spaces + 'primaryKey: true,\n';
                    tables[table] += spaces + spaces + spaces + 'autoIncrement: true,\n';
                  }
                } else {
                  if (tableHasIdField) {
                    if (field == "id") {
                      tables[table] += spaces + spaces + spaces + 'primaryKey: true,\n';
                    } else {
                      if (i==0) {
                        tables[table] += spaces + spaces + spaces + 'primaryKey: true,\n';
                      }
                    }
                  }
                }

                // check if the field is a unique key
                _.each(keys[table].uniqueKeys, function (uniqueKey) {
                  _.each(uniqueKey, function (keys, keyIndex) {
                    if (_.contains(keys, field)) {
                      tables[table] += spaces + spaces + spaces + 'unique: \'' + keyIndex + '\',\n';
                    }
                  });
                });

                var fieldAttr = Object.keys(_tables[table][field]);
                // serial key for postgres...
                var defaultVal = null;
                if (field !== 'updated_on' && field !== "created_on") {
                  defaultVal = _tables[table][field].defaultValue;
                  var isDefaultValQuoted = true;
                  if (_tables[table][field].type == 'TIMESTAMP') {
                    if (defaultVal == 'CURRENT_TIMESTAMP') {
                      defaultVal = "sequelize.literal('CURRENT_TIMESTAMP')";
                      isDefaultValQuoted = false;
                    } else if (defaultVal == '0000-00-00 00:00:00') {
                      defaultVal = null;
                    }
                  }
                }

                if (
                  _.isString(defaultVal) &&
                    defaultVal.toLowerCase().indexOf('nextval') !== -1 &&
                    defaultVal.toLowerCase().indexOf('regclass') !== -1
                  ) {
                  tables[table] += spaces + spaces + spaces + 'type: DataTypes.INTEGER,\n';
                  tables[table] += spaces + spaces + spaces + 'primaryKey: true\n';
                } else {
                  // ENUMs for postgres...
                  if (
                    _tables[table][field].type === 'USER-DEFINED' && !!_tables[table][field].special
                    ) {
                    _tables[table][field].type = 'ENUM(' + _tables[table][field]
                      .special.map(function (f) {
                        return '\'' + f + '\'';
                      })
                      .join(',') + ')';
                  }

                  fieldAttr.forEach(function (attr, x) {
                    // we don't need the special attribute from postgresql describe table..
                    if (attr === 'special') {
                      return true;
                    } else if (attr === 'allowNull') {
                      if (!_.contains(keys[table].primaryKeys, field)) {
                        tables[table] += spaces + spaces + spaces +
                          attr + ': ' + _tables[table][field][attr];
                      } else {
                        tables[table] += spaces + spaces + spaces +
                          attr + ': ' + 'true';
                      }
                    } else if (attr === 'defaultValue') {
                      var valText = defaultVal;
                      if (isDefaultValQuoted && Sequelize.Utils._.isString(defaultVal)) {
                        valText = '\'' + valText + '\'';
                      }
                      if (defaultVal === null) {
                        return true;
                      } else {
                        tables[table] += spaces + spaces + spaces + attr + ': ' + valText;
                      }
                    } else if (
                      attr === 'type' &&
                        _tables[table][field][attr].indexOf('ENUM') === 0
                      ) {
                      tables[table] += spaces + spaces + spaces +
                        attr + ': DataTypes.' + _tables[table][field][attr];
                    } else {
                      var _attr = _tables[table][field][attr].toLowerCase()
                        , val = '\'' + _tables[table][field][attr] + '\'';

                      if (_attr === 'tinyint(1)' || _attr === 'boolean') {
                        val = 'DataTypes.BOOLEAN';
                      } else if (_attr.match(/^(smallint|mediumint|tinyint|int)/)) {
                        var length = _attr.match(/\(\d+\)/);
                        val = 'DataTypes.INTEGER' + (!!length ? length : '');
                      } else if (_attr.match(/^bigint/)) {
                        val = 'DataTypes.BIGINT';
                      } else if (_attr.match(/^string|varchar|varying/)) {
                        val = 'DataTypes.STRING';
                      } else if (_attr.match(/text$/)) {
                        val = 'DataTypes.TEXT';
                      } else if (_attr.match(/^(date|time)/)) {
                        val = 'DataTypes.DATE';
                      } else if (_attr.match(/^(float|decimal)/)) {
                        val = 'DataTypes.' + _attr.toUpperCase();
                      }

                      tables[table] += spaces + spaces + spaces + attr + ': ' + val;
                    }

                    /*
                     if ((x + 1) < fieldAttr.length && fieldAttr[ x + 1 ] !== 'special') {
                     tables[table] += ',';
                     }
                     */
                    tables[table] += ',\n';
                  });
                }

                if (['created_on', 'updated_on'].indexOf(field) > -1) {
                  tables[table] += spaces + spaces + spaces + 'validate: false,\n';
                }


                tables[table] += spaces + spaces + '}';
                if ((i + 1) < fields.length) {
                  tables[table] += ',';
                }
                tables[table] += '\n';
              });

              var timestamps = false;
              var updatedAt = false;
              var createdAt = false;
              if (fields.indexOf('created_on') > -1) {
                timestamps = true;
                createdAt = '\'created_on\'';
              }

              if (fields.indexOf('updated_on') > -1) {
                timestamps = true;
                updatedAt = '\'updated_on\'';
              }

              tables[table] += spaces + '}';
              tables[table] += ',\n' + spaces + '{\n' +
                spaces + spaces + 'freezeTableName: true,\n' +
                spaces + spaces + 'timestamps: ' + (timestamps ? 'true' : 'false') + ',\n' +
                spaces + spaces + 'createdAt: ' + createdAt + ',\n' +
                spaces + spaces + 'updatedAt: ' + updatedAt + ',\n' +
                spaces + spaces + 'underscored: true,\n' +
                spaces + spaces + 'tableName: \'' + table + '\'\n' +
                spaces + '}';
              tables[table] += ');\n};\n';

              _callback(null);
            },

            // after all
            function () {

              // finish the index file content, write associations & export
              index += '\n';
              _.each(keys, function (row, table) {
                if (row.foreignKeys) {
                  _.each(row.foreignKeys, function (foreignKey) {
                    _.each(foreignKey, function (value, key) {
                      index += spaces + 'models.' + _.capitalize(_.camelize(table)) + '.belongsTo(' +
                        'models.' + _.capitalize(_.camelize(value.table)) + ', { ' +
                        'foreignKey: \'' + key + '\' });\n';
                      index += spaces + 'models.' + _.capitalize(_.camelize(value.table)) + '.hasMany(' +
                        'models.' + _.capitalize(_.camelize(table)) + ', { ' +
                        'foreignKey: \'' + key + '\' });\n';
                    });
                  });
                }
              });
              index += '\n' + spaces + 'return models;\n};';

              console.log('Writing files...');

              var models = Object.keys(tables);

              // run these functions in series

              async.series([
                function (_callback) {
                  fs.lstat(options.path + '/base', function (error, stat) {
                    if (error || !stat.isDirectory()) {
                      fs.mkdir(options.path + '/base', _callback);
                    } else {
                      _callback(null);
                    }
                  });
                }
              ],

                // after all
                function (error) {
                  if (error) {
                    return callback(error);
                  }

                  async.each(
                    models,
                    function (model, _callback) {
                      fs.writeFile(
                        options.path + '/base/' + _.dasherize(model) + '.js',
                        tables[model],
                        function (error) {
                          if (error) {
                            return _callback(error);
                          }
                          _callback(null);
                        }
                      );
                    },
                    function (error) {

                      // write the index file
                      fs.writeFile(
                        options.path + '/index.js',
                        index,
                        function (error) {
                          if (error) {
                            throw error;
                          }
                          if (typeof(callback) === 'function') {
                            callback();
                          }
                        }
                      );
                    }
                  );
                });


            });
        });
    });


};