module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PropertyStats', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    stats_date: {
      unique: 'index5',
      type: DataTypes.DATE,
      allowNull: false,
    },
    type: {
      unique: 'index5',
      type: DataTypes.ENUM('ALL','DETACHED','SEMIDETACHED','TOWNHOUSE','APPARTMENT'),
      allowNull: false,
    },
    area_type: {
      unique: 'index5',
      type: DataTypes.ENUM('HOOD','CITY'),
      allowNull: false,
    },
    area_id: {
      unique: 'index5',
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    num_total_listings: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    num_new_listings: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    num_listings_with_price: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    num_listings_with_dom: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    num_listings_with_property_age: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    num_listings_with_bedrooms: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    num_listings_with_lot_size: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    num_listings_with_property_tax: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    num_listings_with_parking_space: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    total_listing_price: {
      type: 'DOUBLE',
      allowNull: true,
    },
    total_dom: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    total_property_age: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    total_num_bedrooms: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    total_lot_size: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    total_property_tax: {
      type: 'DOUBLE',
      allowNull: true,
    },
    total_parking_space_price: {
      type: 'DOUBLE',
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'property_stats'
  });
};
