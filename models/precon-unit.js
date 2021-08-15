var environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , when = require('when')
  ;

module.exports = function (sequelize) {

  var PreconUnit = sequelize.import(PATH + '/models/base/precon-unit');
  _.extend(PreconUnit.options.instanceMethods, {
    addImages: function (project) {
      var self = this;
      return models.PreconUnit.getImages(this.id).then(function (res) {
        _.each(res, function (resource) {
          resource.alt_tag = 'Floorplan for '+project.name+', '+self.dataValues.name+' at '+project.addr_street
                             +((project.addr_postal_code) ? ' '+project.addr_postal_code : '')
                             +' '+project.MainCity.name+' '+project.MainProvince.name+', Canada';;
        });
        self.dataValues.images = res;
        return self;
      });
    },
    addUrl: function () {
      this.dataValues.url = models.PreconUnit.getUrl(this.toJSON());
      return this;
    },
    addField: function (field, value) {
      this.dataValues[field] = value;
    },
    deleteField: function (field) {
      delete(this.dataValues[field]);
    }
  });

  _.extend(PreconUnit.options.classMethods, {
    getImages: function (id) {

      var ResourceTemp = require(PATH + '/lib/resources/manager-temp');
      var resource = new ResourceTemp();
      return resource.getResources(id, 'project_unit_floorplan').then(function (res) {
        return res;
      });
    },
    getProject: function (id) {
      return models.Precon.findById(id).then(function (res) {
        return res;
      });
    },
    getUrl: function (preconUnit) {
      if (preconUnit.hasOwnProperty("Precon") && preconUnit.Precon.hasOwnProperty("name") && preconUnit.Precon.hasOwnProperty("addr_city") && preconUnit.hasOwnProperty('id')) {
        var addr_city_slug = __.convertToWebId(preconUnit.Precon.addr_city);
        var name_slug = __.convertToWebId(preconUnit.Precon.name);
        return '/' + addr_city_slug + '-condos/' + name_slug + '/' + preconUnit.id;
      } else {
        return '';
      }
    }
  });

  PreconUnit.reinit();

  return PreconUnit;

};