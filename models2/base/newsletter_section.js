/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('newsletter_section', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    newsletter_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'newsletter',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cdata: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'newsletter_section'
  });
};
