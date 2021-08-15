/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('resource', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    entity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    entity_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    storage_engine: {
      type: DataTypes.STRING,
      allowNull: true
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'resource'
  });
};
