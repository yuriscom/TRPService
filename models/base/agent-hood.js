module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AgentHood', {
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
    hood_id: {
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
    tableName: 'agent_hood'
  });
};
