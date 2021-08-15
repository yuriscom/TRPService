module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ExclusivePropertyBuildingAmenity', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    exclusive_property_id: {
      unique: 'exclusive_property_id',
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    amenity: {
      unique: 'exclusive_property_id',
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'exclusive_property_building_amenity'
  });
};
