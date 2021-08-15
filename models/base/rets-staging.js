module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RetsStaging', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    rets_feed_run_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    cdata: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('NEW','PROCESSED'),
      allowNull: true,
    },
    processed_on: {
      type: DataTypes.DATE,
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
    tableName: 'rets_staging'
  });
};
