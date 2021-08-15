module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AdCampaignLandingPage', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    ad_campaign_id: {
      unique: 'UNQ__ad_campaign_id',
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    precon_id: {
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
    tableName: 'ad_campaign_landing_page'
  });
};
