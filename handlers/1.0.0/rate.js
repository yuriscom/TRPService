function Rate () {
}

Rate.prototype.version = '1.0.0';

Rate.prototype.getRateByType = function (type) {

  if (typeof type == 'undefined') {
    type = ['interestRate', 'listingRebateCoefficient'];
  }

  return models.Registry.findAll(
    {
      attributes: ['name', 'content'],
      where: {name: type}
    }
  );
};


exports = module.exports = Rate;
