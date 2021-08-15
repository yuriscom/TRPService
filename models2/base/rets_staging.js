/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rets_staging', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    rets_feed_run_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'rets_feed_run',
        key: 'id'
      }
    },
    cdata: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('NEW','PROCESSED'),
      allowNull: true
    },
    processed_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '0000-00-00 00:00:00'
    }
  }, {
    tableName: 'rets_staging'
  });
};
