module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ApiKeyStatus', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sys_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    il8n_code: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'api_key_status'
  });
};
