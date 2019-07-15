var Response = require("../util/response");
var metadataService = require('../services/metadataService');

var metadataController = {
    getMetadata
};

function getMetadata(req, res) {
    var response = new Response();

    metadataService.getMetadata().then((metadata) => {
        response.data.metadata = metadata;
        response.status.statusCode = '200';
        response.status.message = 'Metadata retrieved!!';
        res.status(200).json(response);
    }).catch((err) => {
        response.status.statusCode = '500';
        response.status.message = 'Failed to get metadata: ' + err.message;
        res.status(500).json(response);
    });
}

module.exports = metadataController;