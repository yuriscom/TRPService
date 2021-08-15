/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('agent_hood', {
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
    hood_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'hood',
        key: 'id'
      }
    }
  }, {
    tableName: 'agent_hood'
  });
};
