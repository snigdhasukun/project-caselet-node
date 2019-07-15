var Response = require("../util/response");
var toolService = require('../services/toolService');

var toolController = {
    getTools
};

function getTools(req, res) {
    var response = new Response();

    toolService.getTools().then((tools) => {
        response.data.tools = tools;
        response.status.statusCode = '200';
        response.status.message = 'Tools retrieved!!';
        res.status(200).json(response);
    }).catch((err) => {
        response.status.statusCode = '500';
        response.status.message = 'Failed to get tools: ' + err.message;
        res.status(500).json(response);
    });
}

module.exports = toolController;