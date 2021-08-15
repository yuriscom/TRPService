/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('property_parking', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'property',
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
    tableName: 'property_parking'
  });
};
