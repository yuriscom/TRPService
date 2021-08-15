module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PropertyBuildingAmenity', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    property_id: {
      unique: 'property_id',
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    amenity: {
      unique: 'property_id',
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
    tableName: 'property_building_amenity'
  });
};
