/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('newsletter', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    template: {
      type: DataTypes.STRING,
      allowNull: false
    },
    campaign_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cdata: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    published_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    published_on_label: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hidden: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'newsletter'
  });
};
