/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('precon', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addr_street: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addr_hood: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addr_city_region: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addr_city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addr_province: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addr_postal_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price_min: {
      type: 'DOUBLE',
      allowNull: true
    },
    price_max: {
      type: 'DOUBLE',
      allowNull: true
    },
    sqft_min: {
      type: 'DOUBLE',
      allowNull: true
    },
    sqft_max: {
      type: 'DOUBLE',
      allowNull: true
    },
    community_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    occupancy_year: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    occupancy_details: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    num_pics: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
      defaultValue: '0'
    },
    num_videos: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
      defaultValue: '0'
    },
    num_finishes_pics: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
      defaultValue: '0'
    },
    incentives: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    register_email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    register_phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    twitter_username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    facebook_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    blog_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    num_units: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_floors: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_floorplans: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    finishes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_green: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
    },
    green_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    maintenance_per_sqft: {
      type: 'DOUBLE',
      allowNull: true
    },
    developer_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    school_eligible_address_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'school_eligible_address',
        key: 'id'
      }
    },
    re_district_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 're_district',
        key: 'id'
      }
    },
    beds_min: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    beds_max: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    baths_min: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    baths_max: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    parking_price: {
      type: 'DOUBLE',
      allowNull: true
    },
    locker_price: {
      type: 'DOUBLE',
      allowNull: true
    },
    parking_included: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
    },
    locker_included: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
    },
    is_lake_view: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_luxury: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    precon_status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'precon_status',
        key: 'id'
      }
    },
    amenity_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
    },
    tab_local_info_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    },
    tab_amenities_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    },
    tab_schools_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    },
    tab_investment_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    },
    tab_sales_office_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
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
    web_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    red_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    is_vip_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
    },
    walk_score: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    transit_score: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    province_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'main_province',
        key: 'id'
      }
    },
    region_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'main_region',
        key: 'id'
      }
    },
    city_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'main_city',
        key: 'id'
      }
    },
    hood_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'main_hood',
        key: 'id'
      }
    }
  }, {
    tableName: 'precon'
  });
};
