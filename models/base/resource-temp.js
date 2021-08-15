module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResourceTemp', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    entity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    entity_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    storage_engine: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alt_tag: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: false,
    },
    updated_on: {
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
    tableName: 'resource_temp'
  });
};
