var server = require('./initializer');

// start server, then start command prompt tasks
server.listen(3000, function serverStarted () {
  console.log('Start TheRedPin Application Service');
  require('./tasks');
});