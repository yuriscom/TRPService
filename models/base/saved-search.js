module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SavedSearch', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bounds: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    queries: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notification_frequency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    query: {
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
    },
    last_checked: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    last_sent: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'saved_search'
  });
};
