/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('log_ad_campaign_contact', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    browser: {
      type: DataTypes.STRING,
      allowNull: true
    },
    browser_version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    os: {
      type: DataTypes.STRING,
      allowNull: true
    },
    os_version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    http_referer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    landing_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ad_campaign_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'ad_campaign',
        key: 'id'
      }
    },
    module: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email_to: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email_subject: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email_message: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'log_ad_campaign_contact'
  });
};
