var Response = require("../util/response");
var technologyService = require('../services/technologyService');

var technologyController = {
    getTechnologies
};

function getTechnologies(req, res) {
    var response = new Response();

    technologyService.getTechnologies().then((technologies) => {
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

module.exports = technologyController;