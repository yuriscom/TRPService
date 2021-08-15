/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exclusive_property_status', {
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
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'exclusive_property_status'
  });
};
