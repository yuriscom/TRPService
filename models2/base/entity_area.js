/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('entity_area', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    entity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    entity_type: {
      type: DataTypes.ENUM('resale','presale','exclusive-property'),
      allowNull: false,
      defaultValue: 'resale'
    },
    area_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    area_type: {
      type: DataTypes.ENUM('hood','city','province'),
      allowNull: false
    }
  }, {
    tableName: 'entity_area'
  });
};
