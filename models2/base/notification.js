/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notification', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    notification_medium_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'notification_medium',
        key: 'id'
      }
    },
    ext_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    ext_table: {
      type: DataTypes.STRING,
      allowNull: true
    },
    send_to: {
      type: DataTypes.STRING,
      allowNull: false
    },
    send_from: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('NEW','SENT','FAILED'),
      allowNull: true
    },
    error_message: {
      type: DataTypes.STRING,
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
    tableName: 'notification'
  });
};
