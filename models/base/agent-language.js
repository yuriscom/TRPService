module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AgentLanguage', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    agent_profile_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    lang: {
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
    tableName: 'agent_language'
  });
};
