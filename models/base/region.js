module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Region', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    web_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    i18n_code: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'region'
  });
};
