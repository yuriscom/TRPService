/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('city', {
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
    region_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'region',
        key: 'id'
      }
    },
    province_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'province',
        key: 'id'
      }
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    extra: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    polygon: {
      type: 'POLYGON',
      allowNull: true
    },
    feature_property: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    feature_project: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    }
  }, {
    tableName: 'city'
  });
};
