/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exclusive_property_building_amenity', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    exclusive_property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'exclusive_property',
        key: 'id'
      }
    },
    amenity: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'exclusive_property_building_amenity'
  });
};
