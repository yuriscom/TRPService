/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('agent_profile', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    web_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    experience_years: {
      type: DataTypes.STRING,
      allowNull: true
    },
    experience_text: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transactions: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expertise_condos: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    expertise_freehold: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    expertise_areas: {
      type: DataTypes.STRING,
      allowNull: true
    },
    twitter_feed: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    youtube_source: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    profile_image_src: {
      type: DataTypes.STRING,
      allowNull: true
    },
    thumb_image_src: {
      type: DataTypes.STRING,
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'agent_profile'
  });
};
