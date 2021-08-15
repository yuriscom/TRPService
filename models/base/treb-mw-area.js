module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TrebMwArea', {
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
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    num_active: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    num_new: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    num_sales: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    volume_sales: {
      type: 'DOUBLE',
      allowNull: false,
    },
    avg_price: {
      type: 'DOUBLE',
      allowNull: false,
    },
    med_price: {
      type: 'DOUBLE',
      allowNull: false,
    },
    avg_dom: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    avg_perc_list: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'treb_mw_area'
  });
};
