function Subscription () {
}

Subscription.prototype = new handlers['1.0.0'].subscription();

Subscription.prototype.version = '1.0.1';


exports = module.exports = Subscription;