module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PreconBuilder', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    builder_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    precon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    is_primary_builder: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0',
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'precon_builder'
  });
};
