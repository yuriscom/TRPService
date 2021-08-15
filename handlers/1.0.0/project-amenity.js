function ProjectAmenity () {
}

ProjectAmenity.prototype.version = '1.0.0';

ProjectAmenity.prototype.getById = function (params) {
  return models.PreconPreconAmenity.find({
    where: {
      precon_amenity_id: params.id
    },
    include: [
      { model: models.Precon, attributes: ['id'] },
      { model: models.PreconAmenity }
    ]
  }).then(function (amenity) {
    return amenity;
  });
};

exports = module.exports = ProjectAmenity;
