module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CityHoodBackup', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    city_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    hood_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: 'false',
    updatedAt: 'false',
    underscored: true,
    tableName: 'city_hood_backup'
  });
};
