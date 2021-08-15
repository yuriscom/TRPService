module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Daycare', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    source_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
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
    subsidy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    total_capacity: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    total_vacancy: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    total_subsidy_waiting: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
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
    tableName: 'daycare'
  });
};
