module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Page', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    uri: {
      unique: 'unq_uri',
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    route_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    params: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meta_keyword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    h1_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    h1_blurb: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    h2_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    h2_blurb: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    h3_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    h3_blurb: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    analytic_header: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    analytic_footer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    controller_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '1',
    },
    allow_regeneration: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0',
    },
    show_on_sitemap: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1',
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
    tableName: 'page'
  });
};
