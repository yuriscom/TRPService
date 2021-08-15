module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PreconSalesOffice', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    addr_street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addr_city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addr_province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addr_postal_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_ext: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fax: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    num_pics: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
      defaultValue: '0',
    },
    num_videos: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
      defaultValue: '0',
    },
    hours_of_operation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    precon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Column_1: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'precon_sales_office'
  });
};
