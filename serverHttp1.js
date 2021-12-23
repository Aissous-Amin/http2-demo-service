/**
 * Charger la configuration de l'application.
 */
require('./Config/config');
const ExpressServer = require('./Infrastructure/http1Port/ExpressServer');
const { middlewares } = require('./Application/expressPort/index');

ExpressServer.start(middlewares);
