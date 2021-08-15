var fs = require('fs');

function ucwords(str) {
  return (str + '')
    .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
      return $1.toUpperCase()
    })
}

function getModelNameByFile(filename) {
  var str = filename.replace(".js", "");
  str = str.replace(new RegExp("_", 'g'), " ");
  return ucwords(str).replace(new RegExp(" ", 'g'), "");
}

exports = module.exports = function (sequelize) {
  var models = {};
  var path = __dirname + "/base";
  fs.readdirSync(path).forEach(function (file) {
    if (fs.lstatSync(path + '/' + file).isDirectory()) {
      return;
    } else if (fs.lstatSync(path + '/' + file).isFile()) {
      if (file.slice(-3) !== ".js") {
        return;
      }

      var modelname = getModelNameByFile(file);
      console.log(modelname);

      models[modelname] = (fs.existsSync(__dirname + '/../models/' + file)) ? require(__dirname + '/../models/' + file)(sequelize) : sequelize.import(__dirname + '/base/' + file);
    }
  });

  return models;
}