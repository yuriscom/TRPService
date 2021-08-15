module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PropertyBathroom', {
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
    num: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    num_pieces: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    level: {
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
    tableName: 'property_bathroom'
  });
};
