module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ListingChangelog', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    listing_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    listing_type: {
      type: DataTypes.ENUM('RESALE','PRESALE'),
      allowNull: true,
    },
    changed_field: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prev_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    new_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    event: {
      type: DataTypes.STRING,
      allowNull: true,
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
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'listing_changelog'
  });
};
