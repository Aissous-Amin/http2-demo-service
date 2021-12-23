const path = require('path');
const dir = path.join(process.cwd(), '/Config/.env');

/**
 * Validate config.domain is set.
 *
 * @param {object} config - Objet config.
 */
const DomainCheck = () => {
    if (!process.env.PREFIX) {
        throw new Error('+ Important warning: config.prefix is empty. It should be set to the fully qualified prefix of the app.');
    }
};

/**
 * Initialize global configuration.
 *
 * @returns {object} - Objet config commun à l'application.
 */
const initGlobalConfig = () => {
    // You can do some cool stuff here ....
    require('dotenv').config({ path: dir});
    DomainCheck();
};

/**
 * Set configuration object.
 */
global.__config = initGlobalConfig();
