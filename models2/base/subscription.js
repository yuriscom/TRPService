/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subscription', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    subscription_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    subscription_source_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'subscription_source',
        key: 'id'
      }
    },
    unsubscription_source_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'unsubscription_source',
        key: 'id'
      }
    },
    unsubscription_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    subscription_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'subscription_type',
        key: 'id'
      }
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'subscription'
  });
};
