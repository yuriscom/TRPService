/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('client_affiliation', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'client',
        key: 'id'
      }
    },
    affiliate_type: {
      type: DataTypes.ENUM('BUILDER'),
      allowNull: true
    },
    affiliate_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'client_affiliation'
  });
};
