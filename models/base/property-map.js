module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PropertyMap', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    page_num: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    col_num: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    row: {
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
    tableName: 'property_map'
  });
};
