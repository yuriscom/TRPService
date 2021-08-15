/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('page_history', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    page_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'page',
        key: 'id'
      }
    }
  }, {
    tableName: 'page_history'
  });
};
