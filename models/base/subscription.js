module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Subscription', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
    },
    subscription_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    subscription_source_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    unsubscription_source_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    unsubscription_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    subscription_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: false,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'subscription'
  });
};
