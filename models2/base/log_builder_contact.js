/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('log_builder_contact', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    browser_version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    os: {
      type: DataTypes.STRING,
      allowNull: true
    },
    os_version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    browser: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true
    },
    regarding: {
      type: DataTypes.STRING,
      allowNull: true
    },
    builder_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    email_to: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email_subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email_message: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'log_builder_contact'
  });
};
