/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('agent_profile_agent_badge', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agent_profile_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'agent_profile',
        key: 'id'
      }
    },
    agent_badge_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'agent_badge',
        key: 'id'
      }
    }
  }, {
    tableName: 'agent_profile_agent_badge'
  });
};
