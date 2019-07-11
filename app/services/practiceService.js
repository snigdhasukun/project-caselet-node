var Promise = require('bluebird');

var practiceDao = require('../dao/practiceDao');

var practiceService = {
    addPractice,
    getPractices,
    getPracticeByName
}

function addPractice(practice) {
    return new Promise((resolve, reject) => {
        practiceDao.addPractice(practice).then((practice) => {
            console.log("Practice added! {{In Service}}");
            resolve(practice);
        }).catch((err) => {
            console.log("Failed to add practice {{In Service}}", err);
            reject(err);
        });
    });
}

function getPractices() {
    return new Promise((resolve, reject) => {
        practiceDao.getPractices().then((practices) => {
            console.log("Practices retrieved! {{In Service}}");
            resolve(practices);
        }).catch((err) => {
            console.log("Failed to get practices {{In Service}}", err);
            reject(err);
        });
    });
}

function getPracticeByName(practice) {
    return new Promise((resolve, reject) => {
        practiceDao.getPracticeByName(practice).then((practice) => {
            console.log("Practice retrieved by name! {{In Service}}");
            resolve(practice);
        }).catch((err) => {
            console.log("Failed to get practice by name{{In Service}}", err);
            reject(err);
        });
    });
}

module.exports = practiceService;