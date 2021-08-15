module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MainRegion', {
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
    province_id: {
      unique: 'unq__name',
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    i18n_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    extra: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    feature_property: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
    },
    feature_project: {
      type: DataTypes.INTEGER(4),
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
    tableName: 'main_region'
  });
};
