module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MainProvince', {
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
    web_id: {
      unique: 'unq__name',
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    i18n_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    polygon: {
      type: 'POLYGON',
      allowNull: true,
    },
    pin: {
      type: 'POINT',
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'main_province'
  });
};
