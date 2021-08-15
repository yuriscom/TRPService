module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MediaLink', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    ext_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    owner_type: {
      type: DataTypes.ENUM('PRECON','PRECON_SALES_OFFICE','PRECON_UNIT','PRECON_AMENITY','BUILDER'),
      allowNull: false,
    },
    media_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '1',
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
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
    tableName: 'media_link'
  });
};
