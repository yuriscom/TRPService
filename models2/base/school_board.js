/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('school_board', {
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
    website: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'school_board'
  });
};
