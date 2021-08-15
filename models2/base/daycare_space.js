/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('daycare_space', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    daycare_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'daycare',
        key: 'id'
      }
    },
    daycare_age_cat_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'daycare_age_cat',
        key: 'id'
      }
    },
    capacity: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    vacancy: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    subsidy_waiting: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'daycare_space'
  });
};
