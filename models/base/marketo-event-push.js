module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MarketoEventPush', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      unique: 'UNQ__marketo_event_push__id',
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    marketo_event_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('RECORDED','UNRECORDED'),
      allowNull: false,
    },
    request: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    error: {
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
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    underscored: true,
    tableName: 'marketo_event_push'
  });
};
