module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PreconVip', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    precon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    event_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    vip_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    vip_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    campaign_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    campaign_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    show_on_explorer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0',
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
    tableName: 'precon_vip'
  });
};
