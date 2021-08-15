/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('seo_page', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    page_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'page',
        key: 'id'
      }
    },
    seo_template_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'seo_template',
        key: 'id'
      }
    },
    seo_termination_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'seo_termination',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    media: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    submit_text: {
      type: DataTypes.STRING,
      allowNull: true
    },
    disclaimer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    css: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    google_adwords_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bing_adwords_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ab_termination_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ab_landing_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_published: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    published_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    termination_params: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    }
  }, {
    tableName: 'seo_page'
  });
};
