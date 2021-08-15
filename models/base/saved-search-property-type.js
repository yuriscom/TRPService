module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SavedSearchPropertyType', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    saved_search_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    property_type: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'saved_search_property_type'
  });
};
