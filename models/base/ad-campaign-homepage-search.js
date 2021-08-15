module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AdCampaignHomepageSearch', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link_to: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ad_campaign_id: {
      unique: 'UNQ__ad_campaign_id',
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
    tableName: 'ad_campaign_homepage_search'
  });
};
