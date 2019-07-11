var Response = require("../util/response");
var tagService = require('../services/tagService');

var tagController = {
    getTagCount
};

function getTagCount(req, res) {
    var response = new Response();

    tagService.getTagCount().then((tags) => {
        response.data.tags = tags;
        response.status.statusCode = '200';
        response.status.message = 'Tag Count retrieved!!';
        res.status(200).json(response);
    }).catch((err) => {
        response.status.statusCode = '500';
        response.status.message = 'Failed to get tag count: ' + err.message;
        res.status(500).json(response);
    });
}

module.exports = tagController;