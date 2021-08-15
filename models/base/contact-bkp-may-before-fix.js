module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ContactBkpMayBeforeFix', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    contact_tool_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    contact_type: {
      type: DataTypes.ENUM('BUYER','BUYER - NEW HOME','BUYER - NEW HOME VIP','BUYER - RESALE','SELLER','SELLER - ASSIGNMENT','SELLER - RESALE','RENTAL PROVIDER','RENTAL SEEKER','CONCURRENT'),
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fax: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    subscribe_to_newsletter: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    captured_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
    },
    buyer_postal_codes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    buyer_hoods: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    buyer_city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buyer_province: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buyer_price_from: {
      type: 'DOUBLE',
      allowNull: true,
    },
    buyer_price_to: {
      type: 'DOUBLE',
      allowNull: true,
    },
    buyer_num_beds: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buyer_num_baths: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buyer_lot_size: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buyer_sqft: {
      type: 'DOUBLE',
      allowNull: true,
    },
    buyer_property_age: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buyer_features: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    buyer_timeframe: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buyer_property_ownership: {
      type: DataTypes.ENUM('OWN','RENT','FAMILY','OTHER'),
      allowNull: true,
    },
    buyer_property_type: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    buyer_financing_secured: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    buyer_financing_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    seller_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seller_postal_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seller_hood: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    seller_city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seller_province: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seller_property_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seller_rating: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seller_basement: {
      type: DataTypes.ENUM('FINISHED','UNFINISHED'),
      allowNull: true,
    },
    seller_num_beds: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seller_num_baths: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seller_parking_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seller_listing_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_call_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_tour_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_tour_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_property_style: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_num_beds: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_num_baths: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_price_range: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_move_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    device: {
      type: DataTypes.ENUM('MOBILE','TABLET','COMPUTER'),
      allowNull: true,
    },
    precon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    precon_is_vip: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    prop_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    agent_profile_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    assigned_to_sf_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_source_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    contact_funnel_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
      validate: false,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
      validate: false,
    },
    affiliate_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    aff_track_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aff_track_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aff_comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_duplicate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '0',
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'contact_bkp_may_before_fix'
  });
};
