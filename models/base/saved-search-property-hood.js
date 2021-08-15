module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SavedSearchPropertyHood', {
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
    hood_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'saved_search_property_hood'
  });
};
