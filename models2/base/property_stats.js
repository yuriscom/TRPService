/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('property_stats', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    stats_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('all','detached','semidetached','townhouse','appartment'),
      allowNull: false
    },
    area_type: {
      type: DataTypes.ENUM('hood','city'),
      allowNull: false
    },
    area_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    num_total_listings: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_new_listings: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_listings_with_price: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_listings_with_dom: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_listings_with_property_age: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_listings_with_bedrooms: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_listings_with_lot_size: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_listings_with_property_tax: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_listings_with_parking_space: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    total_listing_price: {
      type: 'DOUBLE',
      allowNull: true
    },
    total_dom: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    total_property_age: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    total_num_bedrooms: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    total_lot_size: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    total_property_tax: {
      type: 'DOUBLE',
      allowNull: true
    },
    total_parking_space_price: {
      type: 'DOUBLE',
      allowNull: true
    }
  }, {
    tableName: 'property_stats'
  });
};
