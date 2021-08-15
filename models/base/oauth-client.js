module.exports = function(sequelize, DataTypes) {
  return sequelize.define('OauthClient', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      unique: 'id_UNIQUE',
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client_id: {
      unique: 'client_id_UNIQUE',
      type: DataTypes.STRING,
      allowNull: false,
    },
    client_secret: {
      unique: 'client_secret_UNIQUE',
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: 'oauth_client'
  });
};
