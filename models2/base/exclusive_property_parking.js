/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exclusive_property_parking', {
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
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    legal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'exclusive_property_parking'
  });
};
