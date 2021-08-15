/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad_campaign_homepage_gallery', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    html: {
      type: DataTypes.TEXT,
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
    tableName: 'ad_campaign_homepage_gallery'
  });
};
