'use strict';

var Utils = require('../../utils')
  , DataTypes = require('../../data-types')
  , util = require('util')
  , reservedWords = [
        'CURRENT_TIMESTAMP'
    ]
   ;

module.exports = (function() {
  var QueryGenerator = {
    dialect: 'mysql',

    createSchema: function() {
      var query = 'SHOW TABLES';
      return Utils._.template(query)({});
    },

    dropSchema: function(tableName, options) {
      return this.dropTableQuery(tableName, options);
    },

    showSchemasQuery: function() {
      return 'SHOW TABLES';
    },

    createTableQuery: function(tableName, attributes, options) {
      options = Utils._.extend({
        engine: 'InnoDB',
        charset: null
      }, options || {});

      var self = this;

      var query = 'CREATE TABLE IF NOT EXISTS <%= table %> (<%= attributes%>)<%= comment %> ENGINE=<%= engine %> <%= charset %> <%= collation %>'
        , primaryKeys = []
        , foreignKeys = {}
        , attrStr = [];

      for (var attr in attributes) {
        if (attributes.hasOwnProperty(attr)) {
          var dataType = attributes[attr]
            , match;

          if (Utils._.includes(dataType, 'PRIMARY KEY')) {
            primaryKeys.push(attr);

            if (Utils._.includes(dataType, 'REFERENCES')) {
               // MySQL doesn't support inline REFERENCES declarations: move to the end
              match = dataType.match(/^(.+) (REFERENCES.*)$/);
              attrStr.push(this.quoteIdentifier(attr) + ' ' + match[1].replace(/PRIMARY KEY/, ''));
              foreignKeys[attr] = match[2];
            } else {
              attrStr.push(this.quoteIdentifier(attr) + ' ' + dataType.replace(/PRIMARY KEY/, ''));
            }
          } else if (Utils._.includes(dataType, 'REFERENCES')) {
            // MySQL doesn't support inline REFERENCES declarations: move to the end
            match = dataType.match(/^(.+) (REFERENCES.*)$/);
            attrStr.push(this.quoteIdentifier(attr) + ' ' + match[1]);
            foreignKeys[attr] = match[2];
          } else {
            attrStr.push(this.quoteIdentifier(attr) + ' ' + dataType);
          }
        }
      }

      var values = {
        table: this.quoteTable(tableName),
        attributes: attrStr.join(', '),
        comment: options.comment && Utils._.isString(options.comment) ? ' COMMENT ' + this.escape(options.comment) : '',
        engine: options.engine,
        charset: (options.charset ? 'DEFAULT CHARSET=' + options.charset : ''),
        collation: (options.collate ? 'COLLATE ' + options.collate : '')
      }
      , pkString = primaryKeys.map(function(pk) { return this.quoteIdentifier(pk); }.bind(this)).join(', ');

      if (!!options.uniqueKeys) {
        Utils._.each(options.uniqueKeys, function(columns, indexName) {
          if (!Utils._.isString(indexName)) {
            indexName = 'uniq_' + tableName + '_' + columns.fields.join('_');
          }
          values.attributes += ', UNIQUE ' + indexName + ' (' + Utils._.map(columns.fields, self.quoteIdentifier).join(', ') + ')';
        });
      }

      if (pkString.length > 0) {
        values.attributes += ', PRIMARY KEY (' + pkString + ')';
      }

      for (var fkey in foreignKeys) {
        if (foreignKeys.hasOwnProperty(fkey)) {
          values.attributes += ', FOREIGN KEY (' + this.quoteIdentifier(fkey) + ') ' + foreignKeys[fkey];
        }
      }

      return Utils._.template(query)(values).trim() + ';';
    },

    showTablesQuery: function() {
      return 'SHOW TABLES;';
    },

    uniqueConstraintMapping: {
      code: 'ER_DUP_ENTRY',
      map: function(str) {
        // we're manually remvoving uniq_ here for a future capability of defining column names explicitly
        var match = str.replace('uniq_', '').match(/Duplicate entry .* for key '(.*?)'$/);
        if (match === null || match.length < 2) {
          return false;
        }

        return {
          indexName: match[1],
          fields: match[1].split('_')
        };
      }
    },

    addColumnQuery: function(table, key, dataType) {
      var query = 'ALTER TABLE <%= table %> ADD <%= attribute %>;'
        , attribute = Utils._.template('<%= key %> <%= definition %>')({
          key: this.quoteIdentifier(key),
          definition: this.attributeToSQL(dataType, {
            context: 'addColumn'
          })
        });

      return Utils._.template(query)({
        table: this.quoteTable(table),
        attribute: attribute
      });
    },

    removeColumnQuery: function(tableName, attributeName) {
      var query = 'ALTER TABLE `<%= tableName %>` DROP `<%= attributeName %>`;';
      return Utils._.template(query)({ tableName: tableName, attributeName: attributeName });
    },

    changeColumnQuery: function(tableName, attributes) {
      var query = 'ALTER TABLE `<%= tableName %>` CHANGE <%= attributes %>;';
      var attrString = [];

      for (var attrName in attributes) {
        var definition = attributes[attrName];

        attrString.push(Utils._.template('`<%= attrName %>` `<%= attrName %>` <%= definition %>')({
          attrName: attrName,
          definition: definition
        }));
      }

      return Utils._.template(query)({ tableName: tableName, attributes: attrString.join(', ') });
    },

    renameColumnQuery: function(tableName, attrBefore, attributes) {
      var query = 'ALTER TABLE `<%= tableName %>` CHANGE <%= attributes %>;';
      var attrString = [];

      for (var attrName in attributes) {
        var definition = attributes[attrName];

        attrString.push(Utils._.template('`<%= before %>` `<%= after %>` <%= definition %>')({
          before: attrBefore,
          after: attrName,
          definition: definition
        }));
      }

      return Utils._.template(query)({ tableName: tableName, attributes: attrString.join(', ') });
    },

    bulkInsertQuery: function(tableName, attrValueHashes, options) {
      var query = 'INSERT<%= ignoreDuplicates %> INTO <%= table %> (<%= attributes %>) VALUES <%= tuples %>;'
        , tuples = []
        , allAttributes = [];

      Utils._.forEach(attrValueHashes, function(attrValueHash, i) {
        Utils._.forOwn(attrValueHash, function(value, key, hash) {
          if (allAttributes.indexOf(key) === -1) allAttributes.push(key);
        });
      });

      Utils._.forEach(attrValueHashes, function(attrValueHash, i) {
        tuples.push('(' +
          allAttributes.map(function(key) {
            return this.escape(attrValueHash[key]);
          }.bind(this)).join(',') +
        ')');
      }.bind(this));

      var replacements = {
        ignoreDuplicates: options && options.ignoreDuplicates ? ' IGNORE' : '',
        table: this.quoteTable(tableName),
        attributes: allAttributes.map(function(attr) {
                      return this.quoteIdentifier(attr);
                    }.bind(this)).join(','),
        tuples: tuples
      };

      return Utils._.template(query)(replacements);
    },

    deleteQuery: function(tableName, where, options) {
      options = options || {};

      var table = this.quoteTable(tableName);
      if (options.truncate === true) {
        // Truncate does not allow LIMIT and WHERE
        return 'TRUNCATE ' + table;
      }

      where = this.getWhereConditions(where);
      var limit = '';

      if (Utils._.isUndefined(options.limit)) {
        options.limit = 1;
      }

      if (!!options.limit) {
        limit = ' LIMIT ' + this.escape(options.limit);
      }

      return 'DELETE FROM ' + table + ' WHERE ' + where + limit;
    },

    showIndexQuery: function(tableName, options) {
      var sql = 'SHOW INDEX FROM <%= tableName %><%= options %>';
      return Utils._.template(sql)({
        tableName: this.quoteTable(tableName),
        options: (options || {}).database ? ' FROM `' + options.database + '`' : ''
      });
    },

    removeIndexQuery: function(tableName, indexNameOrAttributes) {
      var sql = 'DROP INDEX <%= indexName %> ON <%= tableName %>'
        , indexName = indexNameOrAttributes;

      if (typeof indexName !== 'string') {
        indexName = Utils.inflection.underscore(tableName + '_' + indexNameOrAttributes.join('_'));
      }

      return Utils._.template(sql)({ tableName: this.quoteIdentifiers(tableName), indexName: indexName });
    },

    isReservedWord: function(value) {
        return (reservedWords.indexOf(value) > -1);
        /*
        var pattern = "("+reservedWords.join("|")+")";
        var regex = new RegExp(pattern, "i");
        return regex.test(value);
        */
    },

    attributeToSQL: function(attribute, options) {
      if (!Utils._.isPlainObject(attribute)) {
        attribute = {
          type: attribute
        };
      }

      var template;

      if (attribute.type.toString() === DataTypes.ENUM.toString()) {
        template = 'ENUM(' + Utils._.map(attribute.values, function(value) {
          return this.escape(value);
        }.bind(this)).join(', ') + ')';
      } else {
        template = this.dataTypeMapping(null, null, attribute.type.toString());
      }

      if (attribute.allowNull === false) {
        template += ' NOT NULL';
      }

      if (attribute.autoIncrement) {
        template += ' auto_increment';
      }

      // Blobs/texts cannot have a defaultValue
      if (attribute.type !== 'TEXT' && attribute.type._binary !== true && Utils.defaultValueSchemable(attribute.defaultValue)) {
          if (this.isReservedWord(attribute.defaultValue)) {
              template += ' DEFAULT ' + attribute.defaultValue;
          } else {
              template += ' DEFAULT ' + this.escape(attribute.defaultValue);
          }
          console.log(template);
      }

      if (attribute.unique === true) {
        template += ' UNIQUE';
      }

      if (attribute.primaryKey) {
        template += ' PRIMARY KEY';
      }

      if (attribute.references) {
        template += ' REFERENCES ' + this.quoteTable(attribute.references);

        if (attribute.referencesKey) {
          template += ' (' + this.quoteIdentifier(attribute.referencesKey) + ')';
        } else {
          template += ' (' + this.quoteIdentifier('id') + ')';
        }

        if (attribute.onDelete) {
          template += ' ON DELETE ' + attribute.onDelete.toUpperCase();
        }

        if (attribute.onUpdate) {
          template += ' ON UPDATE ' + attribute.onUpdate.toUpperCase();
        }
      }

      return template;
    },

    attributesToSQL: function(attributes, options) {
      var result = {}
        , key
        , attribute;

      for (key in attributes) {
        attribute = attributes[key];
        result[attribute.field || key] = this.attributeToSQL(attribute, options);
      }

      return result;
    },

    findAutoIncrementField: function(factory) {
      var fields = [];

      for (var name in factory.attributes) {
        if (factory.attributes.hasOwnProperty(name)) {
          var definition = factory.attributes[name];

          if (definition && definition.autoIncrement) {
            fields.push(name);
          }
        }
      }

      return fields;
    },

    addLimitAndOffset: function(options, query) {
      query = query || '';
      if (options.offset && !options.limit) {
        query += ' LIMIT ' + options.offset + ', ' + 18440000000000000000;
      } else if (options.limit) {
        if (options.offset) {
          query += ' LIMIT ' + options.offset + ', ' + options.limit;
        } else {
          query += ' LIMIT ' + options.limit;
        }
      }
      return query;
    },

    quoteIdentifier: function(identifier, force) {
      if (identifier === '*') return identifier;
      return Utils.addTicks(identifier, '`');
    },
    /**
     * Generates an SQL query that returns all foreign keys of a table.
     *
     * @param  {String} tableName  The name of the table.
     * @param  {String} schemaName The name of the schema.
     * @return {String}            The generated sql query.
     */
    getForeignKeysQuery: function(tableName, schemaName) {
      return "SELECT CONSTRAINT_NAME as constraint_name FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME = '" + tableName + "' AND CONSTRAINT_NAME!='PRIMARY' AND CONSTRAINT_SCHEMA='" + schemaName + "' AND REFERENCED_TABLE_NAME IS NOT NULL;";
    },

    /**
     * Generates an SQL query that removes a foreign key from a table.
     *
     * @param  {String} tableName  The name of the table.
     * @param  {String} foreignKey The name of the foreign key constraint.
     * @return {String}            The generated sql query.
     */
    dropForeignKeyQuery: function(tableName, foreignKey) {
      return 'ALTER TABLE ' + this.quoteTable(tableName) + ' DROP FOREIGN KEY ' + this.quoteIdentifier(foreignKey) + ';';
    },

    mysqlDataTypeMapping: function(tableName, attr, dataType) {
      return this.dataTypeMapping(tableName, attr, dataType);
    },
    dataTypeMapping: function(tableName, attr, dataType) {
      if (Utils._.includes(dataType, 'UUID')) {
        dataType = dataType.replace(/UUID/, 'CHAR(36) BINARY');
      }

      return dataType;
    }
  };

  return Utils._.extend(Utils._.clone(require('../abstract/query-generator')), QueryGenerator);
})();
