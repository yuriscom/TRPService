module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PreconEvent', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    precon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: false,
    underscored: true,
    tableName: 'precon_event'
  });
};
