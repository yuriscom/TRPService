/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exclusive_property_room', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true
    },
    length: {
      type: 'DOUBLE',
      allowNull: true
    },
    width: {
      type: 'DOUBLE',
      allowNull: true
    },
    desc_1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    desc_2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    desc_3: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'exclusive_property_room'
  });
};
