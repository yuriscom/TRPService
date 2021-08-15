/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('agent_client', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image_src: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'agent_client'
  });
};
