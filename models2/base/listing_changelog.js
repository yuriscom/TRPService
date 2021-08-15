/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('listing_changelog', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    listing_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    listing_type: {
      type: DataTypes.ENUM('resale','presale'),
      allowNull: true
    },
    changed_field: {
      type: DataTypes.STRING,
      allowNull: true
    },
    prev_value: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    new_value: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    event: {
      type: DataTypes.STRING,
      allowNull: true
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '0000-00-00 00:00:00'
    }
  }, {
    tableName: 'listing_changelog'
  });
};
