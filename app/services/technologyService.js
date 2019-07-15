var Promise = require('bluebird');

var technologyDao = require('../dao/technologyDao');

var technologyService = {
    getTechnologies
}

function getTechnologies() {
    return new Promise((resolve, reject) => {

        technologyDao.getTechnologies()
            .then((technologies) => {
                console.log("Technologies retrieved! {{In Service}}");
                resolve(technologies);
            })
            .catch((err) => {
                console.log("Failed to get technologies {{In Service}}", err);
                reject(err);
            });
    });
}

module.exports = technologyService;