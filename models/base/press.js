module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Press', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thumb_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    published_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: false,
    },
    show_on_press: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1',
    },
    show_on_newsletter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1',
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: false,
    underscored: true,
    tableName: 'press'
  });
};
