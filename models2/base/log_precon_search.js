/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('log_precon_search', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    browser_version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    os: {
      type: DataTypes.STRING,
      allowNull: true
    },
    os_version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    browser: {
      type: DataTypes.STRING,
      allowNull: true
    },
    search_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    min_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    max_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    num_bed: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_bath: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sqft: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    occupancy_year: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    min_maint: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    max_maint: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    is_green: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    has_locker: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    has_parking: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    hood: {
      type: DataTypes.STRING,
      allowNull: true
    },
    intersection_1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    intersection_2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    builder: {
      type: DataTypes.STRING,
      allowNull: true
    },
    precon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    district: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'log_precon_search'
  });
};
