/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rets_feed_run_error', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    rets_feed_run_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'rets_feed_run',
        key: 'id'
      }
    },
    error_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    }
  }, {
    tableName: 'rets_feed_run_error'
  });
};
