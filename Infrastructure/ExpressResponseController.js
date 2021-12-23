const httpStatus = require('http-status');
const moment = require('moment');

/**
 * Create_structure function : initialization of the response object structure.
 *
 * @param {string} resource_type - Resource type : domain entities information.
 * @param {object} resource - Response body object.
 * @param {object} links - Link resource information : HATEOAS.
 * @returns {object} Structure - Final response body object structure.
 */
function create_structure(resource_type, resource, links) {
    const structure = {};
    structure._resource_type = (resource_type !== '' ? resource_type : 'Resource_Error');
    structure._resource = resource;
    structure._links = links;
    structure._etag = moment().format('MMMM Do YYYY, h:mm:ss a');
    return structure;
}

/**
 * Message_error function.
 *
 * @param {object} options - Errors message options fields.
 * @returns {object} Message_error_object - Error standard object structure.
 */
function message_error(options) {
    const message_error_object = {};
    message_error_object._api_status_code = options.api_status_code || 4000;
    message_error_object._api_status_message = options.api_status_message || 'Default Message Error';
    message_error_object._api_status_id = options.request_id || '00000-00000-00000-00000-00000'; // TODO apply the request_id logic
    message_error_object._details = options.details || [];
    console.error(`${message_error_object._api_status_message}`);
    return message_error_object;
}

/**
 * Middleware ExpressResponseController.
 *
 * @module ExpressResponseController
 * Allows you to control the body response with a centralized logic by manipulating only the type_content of the request
 * @function
 * @param {object} request - Express request object.
 * @param {object} response - Express response object.
 */
module.exports.ExpressResponseController = (request, response) => {
    try {
        switch (request._type_content) {
        case 'object': {
            const resource = request._resource !== undefined ? request._resource : {};
            const structure = create_structure(request._resource_type, resource, { href: `https://mylocaldomain.net/api${request.url}` });
            structure._request_id = request._request_id;
            structure._resource_type = request._resource_type;
            response.status(httpStatus.OK).json(structure);
            break;
        }
        case 'bad_request_with_errors': {
            request._resource = message_error({
                api_status_code: request._api_status_code ? request._api_status_code : 4000,
                api_status_message: httpStatus['400_NAME'],
                details: request._details ? request._details : [],
            });
            const structure = create_structure('', request._resource, { self: request.url });
            structure._request_id = request._request_id;
            response.status(httpStatus.BAD_REQUEST).json(structure)
                .end();
            break;
        }
        case 'internal_server_with_errors': {
            request._resource = message_error({
                api_status_code: request._api_status_code ? request._api_status_code : 5000,
                api_status_message: httpStatus['500_NAME'],
                request_id: request._request_id,
                details: request._details ? request._details : [],
            });
            const structure = create_structure('', request._resource, { self: request.url });
            structure._request_id = request._request_id;
            response.status(httpStatus.INTERNAL_SERVER_ERROR).json(structure)
                .end();
            break;
        }
        case 'not_found_with_errors': {
            request._resource = message_error({
                api_status_code: request._api_status_code ? request._api_status_code : 4004,
                api_status_message: httpStatus['404_NAME'],
                request_id: request._request_id,
                details: request._details ? request._details : [],
            });
            const structure = create_structure('', request._resource, { self: request.url });
            structure._request_id = request._request_id;
            response.status(httpStatus.NOT_FOUND).json(structure)
                .end();
            break;
        }
        case 'conflict_with_errors': {
            request._resource = message_error({
                api_status_code: request._api_status_code ? request._api_status_code : 4009,
                api_status_message: httpStatus['409_NAME'],
                request_id: request._request_id,
                details: request._details ? request._details : [],
            });
            const structure = create_structure('', request._resource, { self: request.url });
            structure._request_id = request._request_id;
            response.status(httpStatus.CONFLICT).json(structure)
                .end();
            break;
        }
        default: {
            request._resource = message_error({
                api_status_code: request._api_status_code ? request._api_status_code : 5000,
                api_status_message: httpStatus['500_NAME'],
                request_id: request._request_id,
                details: [{ message: 'Type_Content is not defined!' }],
            });
            const structure = create_structure('', request._resource, { self: request.url });
            structure._request_id = request._request_id;
            response.status(httpStatus.INTERNAL_SERVER_ERROR).json(structure)
                .end();
            break;
        }
        }
    } catch (e) {
        console.error(e.message);
    } finally {
        /**
         * We can add interesting features here if we want...
         */
    }
};
