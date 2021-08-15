module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RetsFeedRunError', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    rets_feed_run_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    error_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: false,
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
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'rets_feed_run_error'
  });
};
