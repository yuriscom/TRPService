module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LogAdCampaignContact', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: false,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    browser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    browser_version: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    os: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    os_version: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    http_referer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    landing_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ad_campaign_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    module: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_to: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_message: {
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
    tableName: 'log_ad_campaign_contact'
  });
};
