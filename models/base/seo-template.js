module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SeoTemplate', {
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
    controller: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_manual: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1',
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accepted_params: {
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
    tableName: 'seo_template'
  });
};
