/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('map_area', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    value: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    has_table: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    table_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'map_area'
  });
};
