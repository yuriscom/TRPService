module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AvgPriceToronto', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    year: {
      unique: 'unq__year_month',
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    month: {
      unique: 'unq__year_month',
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    avg_price: {
      type: 'DOUBLE',
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'avg_price_toronto'
  });
};
