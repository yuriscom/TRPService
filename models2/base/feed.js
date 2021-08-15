/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('feed', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    web_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    feed_status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'feed_status',
        key: 'id'
      }
    },
    specs_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    format: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'feed'
  });
};
