/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('daycare_service', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    daycare_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'daycare',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'daycare_service'
  });
};
