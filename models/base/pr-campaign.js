module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PrCampaign', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    name: {
      unique: 'UNQ__pr_campaign__name',
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      unique: 'UNQ__pr_campaign__code',
      type: DataTypes.INTEGER(11),
      allowNull: false,
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
    updatedAt: false,
    underscored: true,
    tableName: 'pr_campaign'
  });
};
