/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('precon_unit', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_sample: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
    },
    is_sold_out: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
    },
    is_comprehensive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
    },
    num_beds: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    num_baths: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    num_parkings: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    has_den: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    has_media: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    has_library: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_award_winner: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_loft: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    from_floor: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    to_floor: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    unit_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bath_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sqft_indoor: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sqft_outdoor: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    has_terrace: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    has_balcony: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    has_locker: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    locker_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    monthly_maintenance: {
      type: 'DOUBLE',
      allowNull: true
    },
    monthly_taxes: {
      type: 'DOUBLE',
      allowNull: true
    },
    price: {
      type: 'DOUBLE',
      allowNull: true
    },
    num_pics: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
      defaultValue: '0'
    },
    num_floorplans: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
      defaultValue: '0'
    },
    orientation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ceiling_height: {
      type: 'DOUBLE',
      allowNull: true
    },
    finishes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
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
    }
  }, {
    tableName: 'precon_unit'
  });
};
