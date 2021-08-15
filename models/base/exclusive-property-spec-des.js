module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ExclusivePropertySpecDes', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    exclusive_property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    spec_des: {
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
    tableName: 'exclusive_property_spec_des'
  });
};
