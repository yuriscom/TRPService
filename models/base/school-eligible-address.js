module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SchoolEligibleAddress', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    municipality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alt_municipality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street_full: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street_direction: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    num_start: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    num_end: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    selector: {
      type: DataTypes.ENUM('ALL','ONLY','ODD','EVEN'),
      allowNull: false,
    },
    orig_range: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'school_eligible_address'
  });
};
