/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rets_feed_run', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    rets_feed_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'rets_feed',
        key: 'id'
      }
    },
    query: {
      type: DataTypes.STRING,
      allowNull: true
    },
    run_start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    run_end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delta_timestamp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    result_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    result_value: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('RUNNING','COMPLETED','TERMINATED'),
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
    tableName: 'rets_feed_run'
  });
};
