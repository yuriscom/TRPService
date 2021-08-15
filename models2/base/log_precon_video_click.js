/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('log_precon_video_click', {
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
    precon_video_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'precon_video',
        key: 'id'
      }
    }
  }, {
    tableName: 'log_precon_video_click'
  });
};
