/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('precon_hood_backup', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    precon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    hood_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'precon_hood_backup'
  });
};
