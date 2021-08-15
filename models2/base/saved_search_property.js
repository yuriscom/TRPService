/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('saved_search_property', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'main_city',
        key: 'id'
      }
    },
    hood_ids: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bounds: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bounds_polygon: {
      type: 'POLYGON',
      allowNull: true
    },
    min_price: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    max_price: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    beds: {
      type: DataTypes.STRING,
      allowNull: true
    },
    baths: {
      type: DataTypes.STRING,
      allowNull: true
    },
    property_type: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notification_frequency: {
      type: DataTypes.STRING,
      allowNull: true
    },
    track_info: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    last_checked: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    last_sent: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: 'CURRENT_TIMESTAMP'
    }
  }, {
    tableName: 'saved_search_property'
  });
};
