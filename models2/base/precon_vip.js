/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('precon_vip', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    precon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'precon',
        key: 'id'
      }
    },
    event_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    vip_start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    vip_end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    campaign_start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    campaign_end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    show_on_explorer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
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
    tableName: 'precon_vip'
  });
};
