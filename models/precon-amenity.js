var environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , when = require('when')
  ;

module.exports = function (sequelize) {

  var PreconAmenity = sequelize.import(PATH + '/models/base/precon-amenity');
  _.extend(PreconAmenity.options.instanceMethods, {
    addImages: function (project) {
      var self = this;
      return models.PreconAmenity.getImages(this.id).then(function (res) {
        _.each(res, function (resource) {
          resource.alt_tag = self.dataValues.name+' at '+project.name+', '+project.addr_street
                             +((project.addr_postal_code) ? ' '+project.addr_postal_code : '')
                             +' '+project.MainCity.name+' '+project.MainProvince.name+', Canada';
        });
        self.dataValues.images = res;
        return self;
      })
    },
    addUrl: function () {
      this.dataValues.url = models.PreconAmenity.getUrl(this.toJSON());
      return this;
    },
    addField: function (field, value) {
      this.dataValues[field] = value;
    },
    deleteField: function (field) {
      delete(this.dataValues[field]);
    }
  });

  _.extend(PreconAmenity.options.classMethods, {
    getImages: function (id, version) {

      var ResourceTemp = require(PATH + '/lib/resources/manager-temp');
      var resource = new ResourceTemp();
      return resource.getResources(id, 'project_amenity').then(function (res) {
        return res;
      });
    },
    getUrl: function (preconAmenity) {
      //TODO: if necessary
    }
  });

  PreconAmenity.reinit();

  return PreconAmenity;

};