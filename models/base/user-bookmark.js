module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserBookmark', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    user_id: {
      unique: 'unique_key',
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    listing_id: {
      unique: 'unique_key',
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    listing_type: {
      unique: 'unique_key',
      type: DataTypes.ENUM('RESALE','PRESALE'),
      allowNull: false,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: false,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: false,
    },
    is_deleted: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0',
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'user_bookmark'
  });
};
