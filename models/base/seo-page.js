module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SeoPage', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    page_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    seo_template_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    seo_termination_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    media: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submit_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disclaimer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    css: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    google_adwords_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bing_adwords_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ab_termination_code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ab_landing_code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_published: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0',
    },
    published_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    termination_params: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: false,
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
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'seo_page'
  });
};
