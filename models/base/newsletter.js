module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Newsletter', {
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
    template: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    campaign_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cdata: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    published_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    published_on_label: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hidden: {
      type: DataTypes.BOOLEAN,
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
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'newsletter'
  });
};
