const common = require('../libs/common.js');

// add each route for application here
module.exports = function (app) {
  app.use('/api/cache', require(common.routing('src/routes', 'Cache.js')));
  // DUMMY TEST ROUTE
  app.use('/api/dummy', require(common.routing('src/routes', 'Test.js')));
};
