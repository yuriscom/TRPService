module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SavedSearchProperty', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    hood_ids: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    polygon_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    polygon: {
      type: 'POLYGON',
      allowNull: true,
    },
    min_price: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    max_price: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    beds: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    baths: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    property_type: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notification_frequency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    track_info: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: false,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: false,
    },
    last_checked: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    last_sent: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'saved_search_property'
  });
};
