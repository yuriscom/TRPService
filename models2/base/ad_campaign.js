/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad_campaign', {
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
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ad_package_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'ad_package',
        key: 'id'
      }
    },
    client_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'client',
        key: 'id'
      }
    },
    ad_campaign_status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'ad_campaign_status',
        key: 'id'
      }
    },
    start_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    full_price: {
      type: 'DOUBLE(10,2)',
      allowNull: true
    },
    discount_amount: {
      type: 'DOUBLE(10,2)',
      allowNull: true
    },
    discount_desciption: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contract_amount: {
      type: 'DOUBLE(10,2)',
      allowNull: true
    },
    contract_signed_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    contract_num: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paid_amount: {
      type: 'DOUBLE(10,2)',
      allowNull: true
    },
    modified_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    created_by: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'ad_campaign'
  });
};
