module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ReDistrict', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      unique: 'code',
      type: DataTypes.STRING,
      allowNull: true,
    },
    re_board_id: {
      unique: 'code',
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    re_city_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 're_district'
  });
};
