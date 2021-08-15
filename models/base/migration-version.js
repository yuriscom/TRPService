module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MigrationVersion', {
    version: {
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
    tableName: 'migration_version'
  });
};
