/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('property_map', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'property',
        key: 'id'
      }
    },
    page_num: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    col_num: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    row: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'property_map'
  });
};
