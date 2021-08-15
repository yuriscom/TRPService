/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('re_district', {
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
    code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    re_board_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 're_board',
        key: 'id'
      }
    },
    re_city_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 're_city',
        key: 'id'
      }
    }
  }, {
    tableName: 're_district'
  });
};
