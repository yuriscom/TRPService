module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PreconHoodBackup', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    precon_id: {
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
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'precon_hood_backup'
  });
};
