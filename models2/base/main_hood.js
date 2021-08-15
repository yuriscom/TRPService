/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('main_hood', {
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
    city_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'main_city',
        key: 'id'
      }
    },
    secondary_cities: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    i18n_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    extra: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    feature_property: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    feature_project: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    polygon: {
      type: 'POLYGON',
      allowNull: true
    },
    pin: {
      type: 'POINT',
      allowNull: true
    }
  }, {
    tableName: 'main_hood'
  });
};
