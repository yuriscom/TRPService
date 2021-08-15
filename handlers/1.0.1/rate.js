function Rate () {
}

Rate.prototype = new handlers['1.0.0'].rate();

Rate.prototype.version = '1.0.1';

exports = module.exports = Rate;
