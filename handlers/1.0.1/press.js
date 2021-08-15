function Press () {
}

Press.prototype = new handlers['1.0.0'].press();

Press.prototype.version = '1.0.1';

exports = module.exports = Press;