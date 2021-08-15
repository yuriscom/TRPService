/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('building_status', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    i18n_code: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'building_status'
  });
};
