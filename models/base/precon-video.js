module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PreconVideo', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    embed_code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    width: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    height: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    hosted_on: {
      type: DataTypes.ENUM('YOUTUBE'),
      allowNull: true,
    },
    autoplay: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '0',
    },
    default_volume: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    rank: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1',
    },
    precon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    modified_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
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
    updatedAt: false,
    underscored: true,
    tableName: 'precon_video'
  });
};
