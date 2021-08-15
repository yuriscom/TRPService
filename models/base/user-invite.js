module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserInvite', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requested_invite_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    invited_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    has_account: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0',
    },
    user_id: {
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
    tableName: 'user_invite'
  });
};
