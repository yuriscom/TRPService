/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('avg_price_toronto', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    month: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    avg_price: {
      type: 'DOUBLE',
      allowNull: false
    }
  }, {
    tableName: 'avg_price_toronto'
  });
};
