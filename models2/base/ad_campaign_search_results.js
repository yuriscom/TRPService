/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad_campaign_search_results', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    teaser_logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    teaser_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    teaser_description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    popup_logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    popup_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    popup_tagline: {
      type: DataTypes.STRING,
      allowNull: true
    },
    popup_footer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    popup_image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    popup_video: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ad_campaign_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'ad_campaign',
        key: 'id'
      }
    }
  }, {
    tableName: 'ad_campaign_search_results'
  });
};
