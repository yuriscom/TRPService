/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('school', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    school_board_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'school_board',
        key: 'id'
      }
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
    fax: {
      type: DataTypes.STRING,
      allowNull: true
    },
    enrollment: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    avail_grades: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    school_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'school_type',
        key: 'id'
      }
    },
    school_level_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'school_level',
        key: 'id'
      }
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
    tableName: 'school'
  });
};
