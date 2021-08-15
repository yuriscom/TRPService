module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PropertyFeature', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    feature: {
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
    tableName: 'property_feature'
  });
};
