module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DaycareSpace', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    daycare_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    daycare_age_cat_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    vacancy: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    subsidy_waiting: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'daycare_space'
  });
};
