/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('school_proficiency', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    school_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'school',
        key: 'id'
      }
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    perc_passed: {
      type: 'DOUBLE',
      allowNull: true
    },
    perc_improved: {
      type: 'DOUBLE',
      allowNull: true
    },
    perc_improved_period: {
      type: DataTypes.STRING,
      allowNull: true
    },
    proficiency_subject_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'proficiency_subject',
        key: 'id'
      }
    }
  }, {
    tableName: 'school_proficiency'
  });
};
