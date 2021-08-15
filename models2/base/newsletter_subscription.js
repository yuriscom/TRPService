/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('newsletter_subscription', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
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
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'registration'
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'newsletter_subscription'
  });
};
