/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('media_link', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ext_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    owner_type: {
      type: DataTypes.ENUM('PRECON','PRECON_SALES_OFFICE','PRECON_UNIT','PRECON_AMENITY','BUILDER'),
      allowNull: false
    },
    media_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '1',
      references: {
        model: 'media_type',
        key: 'id'
      }
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'media_link'
  });
};
