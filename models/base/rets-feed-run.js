module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RetsFeedRun', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    rets_feed_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    query: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    run_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    run_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    delta_timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    result_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    result_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('RUNNING','COMPLETED','TERMINATED'),
      allowNull: true,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: false,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'rets_feed_run'
  });
};
