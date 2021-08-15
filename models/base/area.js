module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Area', {
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
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    value: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    has_table: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    table_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'area'
  });
};
