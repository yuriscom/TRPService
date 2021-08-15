/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('precon_image', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    precon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'precon',
        key: 'id'
      }
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'precon_image'
  });
};
