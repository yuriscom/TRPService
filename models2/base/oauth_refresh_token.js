/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('oauth_refresh_token', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    oauth_client_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'oauth_client',
        key: 'client_id'
      }
    },
    access_token_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'oauth_refresh_token'
  });
};
