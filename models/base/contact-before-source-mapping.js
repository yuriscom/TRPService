module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ContactBeforeSourceMapping', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    contact_tool_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
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
    subscribe_to_newsletter: {
      type: DataTypes.BOOLEAN,
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
    precon_is_vip: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    prop_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    track_page_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    track_landing_page: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    track_http_referer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    track_marketo_cookie: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    track_ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    track_browser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    track_browser_version: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    track_os: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    track_os_version: {
      type: DataTypes.INTEGER(64),
      allowNull: true,
    },
    agent_profile_id: {
      type: DataTypes.INTEGER(11),
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
    contact_source_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    contact_funnel_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
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
    affiliate_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    is_duplicate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '0',
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'contact_before_source_mapping'
  });
};
