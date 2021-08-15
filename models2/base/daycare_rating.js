/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('daycare_rating', {
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
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: 'DOUBLE',
      allowNull: true
    }
  }, {
    tableName: 'daycare_rating'
  });
};
