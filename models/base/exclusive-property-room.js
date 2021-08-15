module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ExclusivePropertyRoom', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    exclusive_property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    length: {
      type: 'DOUBLE',
      allowNull: true,
    },
    width: {
      type: 'DOUBLE',
      allowNull: true,
    },
    desc_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    desc_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    desc_3: {
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
    tableName: 'exclusive_property_room'
  });
};
