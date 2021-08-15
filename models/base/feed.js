module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Feed', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    name: {
      unique: 'UNQ__name',
      type: DataTypes.STRING,
      allowNull: false,
    },
    web_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    feed_status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    specs_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    format: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'feed'
  });
};
