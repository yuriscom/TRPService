module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ExclusivePropertyStatus', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
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
    tableName: 'exclusive_property_status'
  });
};
