/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('landing_termination', {
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
    web_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    controller: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    accepted_params: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    i18n_code: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'landing_termination'
  });
};
