var Response = require("../util/response");
var filterService = require('../services/filterService');

var filterController = {
    getFilters,
    getTechnologies,
    getTools
};

function getFilters(req, res) {
    var response = new Response();

    filterService.getFilters().then((filters) => {
        response.data.filters = filters;
        response.status.statusCode = '200';
        response.status.message = 'Filters retrieved!!';
        res.status(200).json(response);
    }).catch((err) => {
        response.status.statusCode = '500';
        response.status.message = 'Failed to get filters: ' + err.message;
        res.status(500).json(response);
    });
}

function getTechnologies(req, res) {
    var response = new Response();

    filterService.getTechnologies().then((technologies) => {
        response.data.technologies = technologies;
        response.status.statusCode = '200';
        response.status.message = 'Technologies retrieved!!';
        res.status(200).json(response);
    }).catch((err) => {
        response.status.statusCode = '500';
        response.status.message = 'Failed to get technologies: ' + err.message;
        res.status(500).json(response);
    });
}

function getTools(req, res) {
    var response = new Response();

    filterService.getTools().then((tools) => {
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

module.exports = filterController;