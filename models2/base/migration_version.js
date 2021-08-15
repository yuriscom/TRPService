/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('migration_version', {
    version: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'migration_version'
  });
};
