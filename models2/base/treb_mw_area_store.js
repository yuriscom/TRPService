/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('treb_mw_area_store', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    month: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false
    },
    num_active: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    num_new: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    num_sales: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    volume_sales: {
      type: 'DOUBLE',
      allowNull: false
    },
    avg_price: {
      type: 'DOUBLE',
      allowNull: false
    },
    med_price: {
      type: 'DOUBLE',
      allowNull: false
    },
    avg_dom: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    avg_perc_list: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'treb_mw_area_store'
  });
};
