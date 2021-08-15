/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('re_stats_by_city_proptype', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    month: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    re_board_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 're_board',
        key: 'id'
      }
    },
    re_city_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 're_city',
        key: 'id'
      }
    },
    property_type: {
      type: DataTypes.ENUM('DETACHED','SEMI DETACHED','CONDO APT','LINK','CONDO TOWNHOUSE','DETACHED CONDO','COOP APT','TOWNHOUSE'),
      allowNull: true
    },
    num_listings: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_sales: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    avg_price: {
      type: 'DOUBLE',
      allowNull: true
    },
    avg_price_annual_change: {
      type: 'DOUBLE',
      allowNull: true
    },
    perc_sales_active: {
      type: 'DOUBLE',
      allowNull: true
    },
    perc_sales_active_annual_change: {
      type: 'DOUBLE',
      allowNull: true
    }
  }, {
    tableName: 're_stats_by_city_proptype'
  });
};
