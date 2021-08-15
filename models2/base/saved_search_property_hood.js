/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('saved_search_property_hood', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    saved_search_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'saved_search_property',
        key: 'id'
      }
    },
    hood_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'main_hood',
        key: 'id'
      }
    }
  }, {
    tableName: 'saved_search_property_hood'
  });
};
