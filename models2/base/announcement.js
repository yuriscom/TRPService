/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('announcement', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    video_link: {
      type: DataTypes.STRING,
      allowNull: true
    },
    live_link: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'announcement'
  });
};
