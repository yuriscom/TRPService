/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('precon_builder', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    builder_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'builder',
        key: 'id'
      }
    },
    precon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'precon',
        key: 'id'
      }
    },
    is_primary_builder: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'precon_builder'
  });
};
