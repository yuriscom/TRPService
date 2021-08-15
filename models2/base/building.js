/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('building', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
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
    building_status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'building_status',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hood: {
      type: DataTypes.STRING,
      allowNull: true
    },
    used_as: {
      type: DataTypes.STRING,
      allowNull: true
    },
    former_use: {
      type: DataTypes.STRING,
      allowNull: true
    },
    num_floors: {
      type: 'DOUBLE',
      allowNull: true
    },
    height: {
      type: 'DOUBLE',
      allowNull: true
    },
    completion_year: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    companies: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    num_pics: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    heritage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    style: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: true
    },
    developer_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    builder_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'builder',
        key: 'id'
      }
    }
  }, {
    tableName: 'building'
  });
};
