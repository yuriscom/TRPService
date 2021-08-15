module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SchoolEligibility', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    school_id: {
      unique: 'school_id',
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    school_eligible_address_id: {
      unique: 'school_id',
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
    tableName: 'school_eligibility'
  });
};
