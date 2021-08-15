function Project () {
}

Project.prototype = new handlers['1.0.0'].project();

Project.prototype.version = '1.0.1';


exports = module.exports = Project;