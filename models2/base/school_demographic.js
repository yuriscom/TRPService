/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('school_demographic', {
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
    perc_lower_income: {
      type: 'DOUBLE',
      allowNull: true
    },
    perc_university_edu: {
      type: 'DOUBLE',
      allowNull: true
    },
    perc_special_edu: {
      type: 'DOUBLE',
      allowNull: true
    },
    perc_gifted: {
      type: 'DOUBLE',
      allowNull: true
    },
    perc_esl: {
      type: 'DOUBLE',
      allowNull: true
    },
    perc_esl_recent_immigrant: {
      type: 'DOUBLE',
      allowNull: true
    },
    perc_fsl: {
      type: 'DOUBLE',
      allowNull: true
    },
    perc_fsl_recent_immigrant: {
      type: 'DOUBLE',
      allowNull: true
    }
  }, {
    tableName: 'school_demographic'
  });
};
