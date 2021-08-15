module.exports = function(sequelize, DataTypes) {
  return sequelize.define('StreetSuffix', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    main: {
      unique: 'unq_main_syn',
      type: DataTypes.STRING,
      allowNull: true,
    },
    syn: {
      unique: 'unq_main_syn',
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
    tableName: 'street_suffix'
  });
};
