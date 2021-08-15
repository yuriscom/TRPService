/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('school_eligibility', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    school_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'school',
        key: 'id'
      }
    },
    school_eligible_address_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'school_eligible_address',
        key: 'id'
      }
    }
  }, {
    tableName: 'school_eligibility'
  });
};
