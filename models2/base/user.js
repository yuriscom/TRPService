/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    login_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'login_type',
        key: 'id'
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: true
    },
    num_failed_attempts: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    facebook_login_id: {
      type: DataTypes.INTEGER(24),
      allowNull: true,
      references: {
        model: 'facebook_login',
        key: 'id'
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    last_logged_in: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false
    },
    validation_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    validated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    user_status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1',
      references: {
        model: 'user_status',
        key: 'id'
      }
    },
    forgot_password_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    forgot_password_expires_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    affiliate_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    expires_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    pref_move_timeframe: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'user'
  });
};
