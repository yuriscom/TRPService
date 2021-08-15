module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AvgDomToronto', {
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
    avg_dom: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'avg_dom_toronto'
  });
};
