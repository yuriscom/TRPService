module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LogPrCampaignHit', {
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
    pr_campaign_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    mp_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mp_ud_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mp_ud_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mp_ud_3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mp_ud_4: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mp_ud_5: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: false,
    underscored: true,
    tableName: 'log_pr_campaign_hit'
  });
};
