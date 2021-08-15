module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FeedKey', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    feed_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    key_hash: {
      unique: 'unique_key',
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    new_ids_on: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'feed_key'
  });
};
