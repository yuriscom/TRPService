module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TrebMwAreaPropType', {
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
    property_type: {
      type: DataTypes.ENUM('DETACHED','SEMI DETACHED','CONDO APT','LINK','CONDO TOWNHOUSE','DETACHED CONDO','COOP APT','TOWNHOUSE'),
      allowNull: false,
    },
    num_active: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    num_sales: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    avg_price: {
      type: 'DOUBLE',
      allowNull: false,
      defaultValue: '0',
    },
    med_price: {
      type: 'DOUBLE',
      allowNull: false,
      defaultValue: '0',
    },
    perc_sale_active: {
      type: 'DOUBLE',
      allowNull: false,
      defaultValue: '0',
    },
    avg_perc_list: {
      type: 'DOUBLE',
      allowNull: false,
      defaultValue: '0',
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'treb_mw_area_prop_type'
  });
};
