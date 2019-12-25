const users = require('./users/users.service.js');
const links = require('./links/links.service.js');
const links_custom = require('./links/links.custom.js');
const clicks = require('./clicks/clicks.service.js');
const stats = require('./stats/stats.service.js');
const phishtank = require('./phishtank/phishtank.service.js');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  // BAET service endpoints
  app.configure(users);
  app.configure(links);
  app.configure(clicks);
  app.configure(stats);
  // extras and custom services
  app.configure(phishtank);

  // NOTE: this MUST be defined in the end! it's used for route and links etc
  app.configure(links_custom);
};
