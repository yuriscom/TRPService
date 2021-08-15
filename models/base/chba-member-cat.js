module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ChbaMemberCat', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    chba_cat_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    chba_member_id: {
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
    tableName: 'chba_member_cat'
  });
};
