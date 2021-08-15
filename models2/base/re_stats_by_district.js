/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('re_stats_by_district', {
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
    re_district_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 're_district',
        key: 'id'
      }
    },
    num_listings: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_sales: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    num_new: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    avg_price: {
      type: 'DOUBLE',
      allowNull: true
    },
    med_price: {
      type: 'DOUBLE',
      allowNull: true
    },
    avg_dom: {
      type: 'DOUBLE',
      allowNull: true
    },
    perc_sales_active: {
      type: 'DOUBLE',
      allowNull: true
    },
    volume_sales: {
      type: 'DOUBLE',
      allowNull: true
    }
  }, {
    tableName: 're_stats_by_district'
  });
};
