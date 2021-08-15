/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('property_building_amenity', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'property',
        key: 'id'
      }
    },
    amenity: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'property_building_amenity'
  });
};
