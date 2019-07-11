var Response = require("../util/response");
var userService = require('../services/userService');

var userController = {
    addUser
};

function addUser(req, res) {
    var response = new Response();

    userService.addUser(req.user.mid)
        .then((searchResults) => {
        response.data.user = searchResults;
        response.status.statusCode = '200';
        response.status.message = 'Project retrieved!!';
        res.status(200).json(response);
    }).catch((err) => {
        response.status.statusCode = '500';
        response.status.message = 'Failed to search project: ' + err.message;
        res.status(500).json(response);
    });
}

module.exports = userController;
