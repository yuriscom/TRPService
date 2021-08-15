module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Notification', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      unique: 'UNQ__notification__id',
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    notification_medium_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    ext_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    ext_table: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    send_to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    send_from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('NEW','SENT','FAILED'),
      allowNull: true,
    },
    error_message: {
      type: DataTypes.STRING,
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
    tableName: 'notification'
  });
};
