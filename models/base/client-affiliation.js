module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ClientAffiliation', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    client_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    affiliate_type: {
      type: DataTypes.ENUM('BUILDER'),
      allowNull: true,
    },
    affiliate_id: {
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
    tableName: 'client_affiliation'
  });
};
