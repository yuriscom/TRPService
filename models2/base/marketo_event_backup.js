/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('marketo_event_backup', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    ext_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ext_table: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ext_params: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lead_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('NEW','PUSHED','FAILED','PROCESSING','DELAYED'),
      allowNull: true,
      defaultValue: 'NEW'
    },
    error_message: {
      type: DataTypes.STRING,
      allowNull: true
    },
    marketo_event_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    track_marketo_cookie: {
      type: DataTypes.STRING,
      allowNull: true
    },
    track_landing_page: {
      type: DataTypes.STRING,
      allowNull: true
    },
    track_http_referrer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    track_page_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    track_ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    track_browser: {
      type: DataTypes.STRING,
      allowNull: true
    },
    track_browser_version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    track_os: {
      type: DataTypes.STRING,
      allowNull: true
    },
    track_os_version: {
      type: DataTypes.INTEGER(64),
      allowNull: true
    },
    track_channel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    track_campaign: {
      type: DataTypes.STRING,
      allowNull: true
    },
    track_sub_campaign: {
      type: DataTypes.STRING,
      allowNull: true
    },
    track_keywords: {
      type: DataTypes.STRING,
      allowNull: true
    },
    track_placement: {
      type: DataTypes.STRING,
      allowNull: true
    },
    track_network: {
      type: DataTypes.STRING,
      allowNull: true
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    locked_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    locked_until: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    }
  }, {
    tableName: 'marketo_event_backup'
  });
};
