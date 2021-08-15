module.exports = function(sequelize, DataTypes) {
  return sequelize.define('School', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    school_board_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    addr_street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addr_city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addr_province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addr_postal_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fax: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    enrollment: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    avail_grades: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    school_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    school_level_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true,
    tableName: 'school'
  });
};
