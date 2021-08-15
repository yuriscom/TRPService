/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad_campaign_sem', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ad_campaign_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'ad_campaign',
        key: 'id'
      }
    },
    precon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'precon',
        key: 'id'
      }
    }
  }, {
    tableName: 'ad_campaign_sem'
  });
};
