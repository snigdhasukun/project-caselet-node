var Promise = require('bluebird');

var toolDao = require('../dao/toolDao');

var toolService = {
    getTools
}

function getTools() {
    return new Promise((resolve, reject) => {

        toolDao.getTools()
            .then((tools) => {
                console.log("Tools retrieved! {{In Service}}");
                resolve(tools);
            })
            .catch((err) => {
                console.log("Failed to get tools {{In Service}}", err);
                reject(err);
            });
    });
}

module.exports = toolService;