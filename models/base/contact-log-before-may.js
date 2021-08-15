module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ContactLogBeforeMay', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    contact_tool_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    name: {
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
    fax: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pref_call_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_tour_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_tour_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_property_style: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_num_beds: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_num_baths: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_price_range: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pref_move_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    precon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    precon_vip_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    prop_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    page_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tracking_params: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    browser: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    browser_version: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    os: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    os_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
      validate: false,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
      validate: false,
    },
    crm_status: {
      type: DataTypes.ENUM('UNRECORDED','RECORDED','ERROR'),
      allowNull: false,
      defaultValue: 'UNRECORDED',
    },
    crm_attempted_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    crm_response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    affiliate_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'contact_log_before_may'
  });
};
