module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserAffiliate', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    user_id: {
      unique: 'user_id',
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    contact_source_id: {
      unique: 'user_id',
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
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
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'user_affiliate'
  });
};
