/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chba_member_cat', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    chba_cat_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'chba_cat',
        key: 'id'
      }
    },
    chba_member_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'chba_member',
        key: 'id'
      }
    }
  }, {
    tableName: 'chba_member_cat'
  });
};
