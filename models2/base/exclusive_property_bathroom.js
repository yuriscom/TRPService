/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exclusive_property_bathroom', {
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
    num: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_pieces: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'exclusive_property_bathroom'
  });
};
