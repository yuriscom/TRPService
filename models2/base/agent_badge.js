/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('agent_badge', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image_src: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'agent_badge'
  });
};
