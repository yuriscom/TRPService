module.exports = function(sequelize, DataTypes) {
  return sequelize.define('EventType', {
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
    sys_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ext_table: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_unique: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'event_type'
  });
};
