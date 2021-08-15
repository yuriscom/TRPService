module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DaycareRating', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    daycare_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: 'DOUBLE',
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'daycare_rating'
  });
};
