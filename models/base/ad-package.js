module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AdPackage', {
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
    campaign_type_table: {
      type: DataTypes.ENUM('AD_CAMPAIGN_HOMEPAGE_SEARCH','AD_CAMPAIGN_HOMEPAGE_GALLERY','AD_CAMPAIGN_SEARCH_RESULTS'),
      allowNull: true,
    },
    price: {
      type: 'DOUBLE(10,2)',
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    modified_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: false,
    },
    created_by: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: false,
    underscored: true,
    tableName: 'ad_package'
  });
};
