var http = require('http');
var when = require('when');

function UrlForward () {
}

UrlForward.prototype.version = '1.0.1';

UrlForward.prototype.getByOrigUrl = function (url) {
    return models.UrlForward.find({
            where: { orig_url: url }
        }
    );
};


exports = module.exports = UrlForward;