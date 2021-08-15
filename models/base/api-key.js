module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ApiKey', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    user_id: {
      unique: 'user_id',
      unique: 'user_id_2',
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    key_hash: {
      unique: 'unq__key_hash',
      type: DataTypes.STRING,
      allowNull: false,
    },
    api_key_status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: false,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'api_key'
  });
};
