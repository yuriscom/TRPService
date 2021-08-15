module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserEmail', {
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: 'false',
    updatedAt: 'false',
    underscored: true,
    tableName: 'user_email'
  });
};
