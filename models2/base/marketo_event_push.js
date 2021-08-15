/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('marketo_event_push', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    marketo_event_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'marketo_event',
        key: 'id'
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('RECORDED','UNRECORDED'),
      allowNull: false
    },
    request: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'marketo_event_push'
  });
};
