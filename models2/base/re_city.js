/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('re_city', {
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
    re_board_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 're_board',
        key: 'id'
      }
    }
  }, {
    tableName: 're_city'
  });
};
