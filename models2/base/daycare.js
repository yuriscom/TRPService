/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('daycare', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    source_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addr_street: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addr_city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addr_province: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addr_postal_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subsidy: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    total_capacity: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    total_vacancy: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    total_subsidy_waiting: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'daycare'
  });
};
