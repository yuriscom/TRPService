/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exclusive_property', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    addr_full: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addr_full_slug: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addr_intersection: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addr_intersection_slug: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addr_hood: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addr_hood_slug: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addr_city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addr_city_slug: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addr_street: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addr_street_dir: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addr_street_suffix: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addr_street_num: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addr_postal_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addr_province: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addr_unit_num: {
      type: DataTypes.STRING,
      allowNull: true
    },
    air_conditioning: {
      type: DataTypes.STRING,
      allowNull: true
    },
    architectural_style: {
      type: DataTypes.STRING,
      allowNull: true
    },
    balcony: {
      type: DataTypes.STRING,
      allowNull: true
    },
    basement_1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    basement_2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    broker: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    client_remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    condo_exposure: {
      type: DataTypes.STRING,
      allowNull: true
    },
    condo_management: {
      type: DataTypes.STRING,
      allowNull: true
    },
    construction_style_attachment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    display_address: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    drive: {
      type: DataTypes.STRING,
      allowNull: true
    },
    elevator: {
      type: DataTypes.STRING,
      allowNull: true
    },
    energy_cert: {
      type: DataTypes.STRING,
      allowNull: true
    },
    energy_cert_level: {
      type: DataTypes.STRING,
      allowNull: true
    },
    exterior_1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    exterior_2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    extras: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fronting: {
      type: DataTypes.STRING,
      allowNull: true
    },
    furnishing: {
      type: DataTypes.STRING,
      allowNull: true
    },
    garage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    green_pis: {
      type: DataTypes.STRING,
      allowNull: true
    },
    has_cable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    has_central_vac: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    has_family_room: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    num_fireplaces: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    has_gas: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    has_handi_equip: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    has_hydro: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    has_ensuite_laundry: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    has_private_entrance: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    has_telephone: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    heating_source: {
      type: DataTypes.STRING,
      allowNull: true
    },
    heating_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_out_of_area: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_retirement: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    laundry: {
      type: DataTypes.STRING,
      allowNull: true
    },
    laundry_level: {
      type: DataTypes.STRING,
      allowNull: true
    },
    locker: {
      type: DataTypes.STRING,
      allowNull: true
    },
    locker_num: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lot_acreage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lot_depth: {
      type: 'DOUBLE',
      allowNull: true
    },
    lot_front: {
      type: 'DOUBLE',
      allowNull: true
    },
    lot_irregularities: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lot_size_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mls_num: {
      type: DataTypes.STRING,
      allowNull: true
    },
    monthly_maintenance: {
      type: 'DOUBLE',
      allowNull: true
    },
    num_baths: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_beds: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_beds_plus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_kitchens: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_kitchens_plus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_rooms: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_rooms_plus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_garages: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_parkings: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    occupancy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    other_structures_1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    other_structures_2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    parcel_num: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parking: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parking_monthly_cost: {
      type: 'DOUBLE',
      allowNull: true
    },
    pets: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pool: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: 'DOUBLE',
      allowNull: true
    },
    seller_pis: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sewers: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sqft: {
      type: DataTypes.STRING,
      allowNull: true
    },
    taxes: {
      type: 'DOUBLE',
      allowNull: true
    },
    taxes_year: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    uffi: {
      type: DataTypes.STRING,
      allowNull: true
    },
    water: {
      type: DataTypes.STRING,
      allowNull: true
    },
    water_source: {
      type: DataTypes.STRING,
      allowNull: true
    },
    waterfront: {
      type: DataTypes.STRING,
      allowNull: true
    },
    zoning: {
      type: DataTypes.STRING,
      allowNull: true
    },
    municipality_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    municipality_district: {
      type: DataTypes.STRING,
      allowNull: true
    },
    municipality: {
      type: DataTypes.STRING,
      allowNull: true
    },
    precon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'precon',
        key: 'id'
      }
    },
    unit_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deposit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    incentives: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    exclusive_property_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'exclusive_property_type',
        key: 'id'
      }
    },
    exclusive_property_trp_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'exclusive_property_trp_type',
        key: 'id'
      }
    },
    exclusive_property_ownership_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'exclusive_property_ownership',
        key: 'id'
      }
    },
    exclusive_property_status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'exclusive_property_status',
        key: 'id'
      }
    },
    exclusive_property_style_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'exclusive_property_style',
        key: 'id'
      }
    },
    exclusive_property_sale_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'exclusive_property_sale_type',
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
    lat: {
      type: 'DOUBLE',
      allowNull: true
    },
    lng: {
      type: 'DOUBLE',
      allowNull: true
    },
    unit_num: {
      type: DataTypes.STRING,
      allowNull: true
    },
    virtual_tour_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    walk_score: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    transit_score: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
    },
    is_public_updated_on: {
      type: DataTypes.DATE,
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
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'exclusive_property'
  });
};
