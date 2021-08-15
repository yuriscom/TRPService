/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rets_feed', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    board: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    login_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    login_username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    login_password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    login_user_agent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    login_user_agent_pwd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    login_user_agent_auth: {
      type: DataTypes.ENUM('0','1'),
      allowNull: true
    },
    login_rets_version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    login_standard_names: {
      type: DataTypes.ENUM('0','1'),
      allowNull: true
    },
    login_post_requests: {
      type: DataTypes.ENUM('0','1'),
      allowNull: true
    },
    login_format: {
      type: DataTypes.ENUM('COMPACT','COMPACT-DECODED','STANDARD-XML'),
      allowNull: false
    },
    resource: {
      type: DataTypes.STRING,
      allowNull: true
    },
    class: {
      type: DataTypes.STRING,
      allowNull: true
    },
    count: {
      type: DataTypes.ENUM('0','1','2'),
      allowNull: false
    },
    format: {
      type: DataTypes.ENUM('COMPACT','COMPACT-DECODED','STANDARD-XML'),
      allowNull: false
    },
    limit: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    query_type: {
      type: DataTypes.ENUM('DMQL2','DMQL'),
      allowNull: true
    },
    standard_names: {
      type: DataTypes.ENUM('0','1'),
      allowNull: true
    },
    select: {
      type: DataTypes.STRING,
      allowNull: true
    },
    query: {
      type: DataTypes.STRING,
      allowNull: true
    },
    delta_timestamp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('RUNNING','READY','TERMINATED'),
      allowNull: false
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '0000-00-00 00:00:00'
    }
  }, {
    tableName: 'rets_feed'
  });
};
