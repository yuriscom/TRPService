/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('re_district_boundary', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: false
    },
    re_district_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 're_district',
        key: 'id'
      }
    }
  }, {
    tableName: 're_district_boundary'
  });
};
