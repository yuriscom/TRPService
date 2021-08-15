/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('street_suffix', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    main: {
      type: DataTypes.STRING,
      allowNull: true
    },
    syn: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'street_suffix'
  });
};
