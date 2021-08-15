/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad_package', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    campaign_type_table: {
      type: DataTypes.ENUM('AD_CAMPAIGN_HOMEPAGE_SEARCH','AD_CAMPAIGN_HOMEPAGE_GALLERY','AD_CAMPAIGN_SEARCH_RESULTS'),
      allowNull: true
    },
    price: {
      type: 'DOUBLE(10,2)',
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modified_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    created_by: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'ad_package'
  });
};
