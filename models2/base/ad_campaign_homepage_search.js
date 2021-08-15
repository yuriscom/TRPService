/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad_campaign_homepage_search', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    link_to: {
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
    tableName: 'ad_campaign_homepage_search'
  });
};
