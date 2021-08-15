/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exclusive_property_spec_des', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    exclusive_property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'exclusive_property',
        key: 'id'
      }
    },
    spec_des: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'exclusive_property_spec_des'
  });
};
