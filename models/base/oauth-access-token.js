module.exports = function(sequelize, DataTypes) {
  return sequelize.define('OauthAccessToken', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      unique: 'id_UNIQUE',
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    oauth_client_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: false,
    underscored: true,
    tableName: 'oauth_access_token'
  });
};
