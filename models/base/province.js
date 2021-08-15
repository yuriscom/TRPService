module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Province', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    name: {
      unique: 'unq__name',
      type: DataTypes.STRING,
      allowNull: false,
    },
    web_id: {
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
    bounds: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    polygon: {
      type: 'POLYGON',
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'province'
  });
};
