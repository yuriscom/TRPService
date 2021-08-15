module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ReStatsByCity', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    re_board_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    re_city_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    num_listings: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    num_sales: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    avg_price: {
      type: 'DOUBLE',
      allowNull: true,
    },
    perc_sales_active: {
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
    tableName: 're_stats_by_city'
  });
};
