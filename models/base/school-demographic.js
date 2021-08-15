module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SchoolDemographic', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    school_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    perc_lower_income: {
      type: 'DOUBLE',
      allowNull: true,
    },
    perc_university_edu: {
      type: 'DOUBLE',
      allowNull: true,
    },
    perc_special_edu: {
      type: 'DOUBLE',
      allowNull: true,
    },
    perc_gifted: {
      type: 'DOUBLE',
      allowNull: true,
    },
    perc_esl: {
      type: 'DOUBLE',
      allowNull: true,
    },
    perc_esl_recent_immigrant: {
      type: 'DOUBLE',
      allowNull: true,
    },
    perc_fsl: {
      type: 'DOUBLE',
      allowNull: true,
    },
    perc_fsl_recent_immigrant: {
      type: 'DOUBLE',
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'school_demographic'
  });
};
