module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AdCampaign', {
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ad_package_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    client_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    ad_campaign_status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    start_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    full_price: {
      type: 'DOUBLE(10,2)',
      allowNull: true,
    },
    discount_amount: {
      type: 'DOUBLE(10,2)',
      allowNull: true,
    },
    discount_desciption: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contract_amount: {
      type: 'DOUBLE(10,2)',
      allowNull: true,
    },
    contract_signed_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    contract_num: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paid_amount: {
      type: 'DOUBLE(10,2)',
      allowNull: true,
    },
    modified_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: false,
    },
    created_by: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: false,
    underscored: true,
    tableName: 'ad_campaign'
  });
};
