/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('precon_precon_amenity', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    precon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'precon',
        key: 'id'
      }
    },
    precon_amenity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'precon_amenity',
        key: 'id'
      }
    }
  }, {
    tableName: 'precon_precon_amenity'
  });
};
