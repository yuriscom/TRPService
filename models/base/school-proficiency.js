module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SchoolProficiency', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    school_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    perc_passed: {
      type: 'DOUBLE',
      allowNull: true,
    },
    perc_improved: {
      type: 'DOUBLE',
      allowNull: true,
    },
    perc_improved_period: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    proficiency_subject_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'school_proficiency'
  });
};
