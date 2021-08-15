module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Registry', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    domain: {
      unique: 'domain',
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      unique: 'domain',
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'registry'
  });
};
