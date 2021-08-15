module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Announcement', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    video_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    live_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'announcement'
  });
};
