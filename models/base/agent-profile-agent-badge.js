module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AgentProfileAgentBadge', {
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
    agent_badge_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'agent_profile_agent_badge'
  });
};
