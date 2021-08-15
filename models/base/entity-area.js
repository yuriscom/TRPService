module.exports = function(sequelize, DataTypes) {
  return sequelize.define('EntityArea', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    entity_id: {
      unique: 'unique',
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    entity_type: {
      unique: 'unique',
      type: DataTypes.ENUM('RESALE','PRESALE','EXCLUSIVE-PROPERTY'),
      allowNull: false,
      defaultValue: 'resale',
    },
    area_id: {
      unique: 'unique',
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    area_type: {
      unique: 'unique',
      type: DataTypes.ENUM('HOOD','CITY','PROVINCE'),
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'entity_area'
  });
};
