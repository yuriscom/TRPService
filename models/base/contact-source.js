module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ContactSource', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sys_name: {
      unique: 'sys_name',
      type: DataTypes.STRING,
      allowNull: true,
    },
    active_on_backend: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0',
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
    tableName: 'contact_source'
  });
};
