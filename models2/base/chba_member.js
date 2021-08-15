/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chba_member', {
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
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false
    },
    chba_association_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'chba_association',
        key: 'id'
      }
    }
  }, {
    tableName: 'chba_member'
  });
};
