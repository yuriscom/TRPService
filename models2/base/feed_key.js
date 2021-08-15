/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('feed_key', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    feed_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'feed',
        key: 'id'
      }
    },
    key_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    new_ids_on: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'feed_key'
  });
};
