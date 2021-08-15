module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Event', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    event_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    ext_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    ext_table: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payload: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notification_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'event'
  });
};
