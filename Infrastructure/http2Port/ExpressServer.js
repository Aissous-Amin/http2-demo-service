const http2 = require('http2');
const fs = require('fs');
const express = require('express');
const http2Express = require('http2-express-bridge');
const cors = require('cors');
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
        const app = http2Express(express);
        /** Add Api-Version to Header Response. */
        app.use((request, response, next) => {
            response.setHeader('Api-Version', '1.0.0');
            next();
        });
        app.use(cors());
        return app;
    }

    static http_listen(app) {
        const options =  {
                key: fs.readFileSync(process.env.KEY),
                cert: fs.readFileSync(process.env.CERT),
                allowHTTP1: true
            }
        server = http2.createSecureServer(options, app);
        server.listen(process.env.PORT || 3001);
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
            console.log('Server express http2 is running on port : ', process.env.PORT);
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