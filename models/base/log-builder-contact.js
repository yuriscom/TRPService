module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LogBuilderContact', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: false,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    browser_version: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    os: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    os_version: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    browser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    regarding: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    builder_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    email_to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_message: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: false,
    underscored: true,
    tableName: 'log_builder_contact'
  });
};
