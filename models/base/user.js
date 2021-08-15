module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    login_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    username: {
      unique: 'unq_username_role',
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    num_failed_attempts: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0',
    },
    facebook_login_id: {
      type: DataTypes.INTEGER(24),
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role_id: {
      unique: 'unq_username_role',
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    last_logged_in: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: false,
    },
    validation_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    validated_on: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1',
    },
    forgot_password_token: {
      unique: 'forgot_password_token_UNIQUE',
      type: DataTypes.STRING,
      allowNull: true,
    },
    forgot_password_expires_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    affiliate_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    expires_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: false,
    },
    pref_move_timeframe: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'user'
  });
};
