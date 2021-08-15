module.exports = function(sequelize, DataTypes) {
  return sequelize.define('NotificationPush', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      unique: 'UNQ__notfication_push__id',
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    notification_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('SENT','FAILED'),
      allowNull: false,
    },
    request: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    result: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'notification_push'
  });
};
