const express = require('express');
const ResponseController = require('../../Infrastructure/ExpressResponseController');
const path = require("path");

module.exports = (app) => {
    const versionRouter = express.Router();
    // Tous les end-point seront accessible sur chemin __config.prefix.
    app.use(process.env.PREFIX, versionRouter);
    versionRouter.get('/test', (request, response, next) => {
        request._type_content = 'object';
        request._resource_type = 'Resource_Test';
        request._resource = {
            message: 'Http2 Hello World!',
        }
        next();
    },
        ResponseController.ExpressResponseController,
    );

    versionRouter.get(`/images/:id`, (request, response, next) => {
                // response.sendFile(path.join(process.cwd(), `Config/lib/img/scott_${request.params.id}.png`))
                response.sendFile(path.join(process.cwd(), `Config/lib/img3/27-${request.params.id}.jpg`))
            });

    /** Catch unhandled errors. */
    app.all('*', (request, response) => {
        request._type_content = 'not_found_with_errors';
        request._details = { message: 'The server could not find the requested resource' };
        response.status(404).json({
            _resource_type: request._type_content,
            _resource: request._details,
            _links: {},
            _etag: Date.now(),
        })
    });

    app.use((error, request, response) => {
        console.error(error);
        request._type_content = 'internal_server_with_errors';
        request._details = { message: error.message };
        response.status(404).json({
            _resource_type: request._type_content,
            _resource: request._details,
            _links: {},
            _etag: Date.now(),
        })
    });

}