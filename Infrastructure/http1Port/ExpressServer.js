const https = require('https');
const fs = require('fs');
const express = require('express');

/**
 *{http.ExpressServer} Web Server.
 */
let server;

class ExpressServer {
    /**
     * Fonction d'initialisation du serveur API.
     *
     * @returns {*|void|Promise<void>}
     */
    static async init() {
        const app = express();
        /** Add Api-Version to Header Response. */
        app.use((request, response, next) => {
            response.setHeader('Api-Version', '1.0.0');
            next();
        });
        return app;
    }

    static http_listen(app) {
        const options =  {
                key: fs.readFileSync(process.env.KEY),
                cert: fs.readFileSync(process.env.CERT),
                allowHTTP1: true
            }
        server = https.createServer(options, app);
        server.listen(3001);
        return server;
    }

    /**
     * Fonction de lancement d'application.
     *
     * @returns {Promise<void>} Retourne une promise.
     */
    static async start(routes) {
        try {
            const app = await ExpressServer.init();
            /** Init service end-points. */
            routes(app);
            await this.http_listen(app);
            console.log('Server express http1 is running on port : ', 3001);
            return app;
        } catch (err) {
            console.error(err);
        } finally {

        }
    }

    /**
     * Stoper l'application.
     */
    static close() {
        server.close();
    }
}

/**
 * Module Web du service.
 *
 * @exports Infrastructure/http/ExpressServer
 * */
module.exports = ExpressServer;
