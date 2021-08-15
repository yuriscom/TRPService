/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('province', {
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
    web_id: {
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
    },
    bounds: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    polygon: {
      type: 'POLYGON',
      allowNull: true
    }
  }, {
    tableName: 'province'
  });
};
