module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MarketoEventType', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    name: {
      unique: 'UNQ__marketo_event_type__name',
      type: DataTypes.STRING,
      allowNull: false,
    },
    sys_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: 'marketo_event_type'
  });
};