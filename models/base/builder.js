module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Builder', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    web_id: {
      unique: 'web_id',
      type: DataTypes.STRING,
      allowNull: false,
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
    fax: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twitter_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebook_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    blog_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lng: {
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
    tableName: 'builder'
  });
};
