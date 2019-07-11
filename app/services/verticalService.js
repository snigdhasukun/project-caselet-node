var Promise = require('bluebird');

var verticalDao = require('../dao/verticalDao');


var verticalService = {
    addVertical,
    getVerticals,
    getVerticalByName
}

function addVertical(vertical) {
    return new Promise((resolve, reject) => {
        verticalDao.addVertical(vertical).then((vertical) => {
            console.log("Vertical added! {{In Service}}");
            resolve(vertical);
        }).catch((err) => {
            console.log("Failed to add vertical {{In Service}}", err);
            reject(err);
        });
    });
}

function getVerticals() {
    return new Promise((resolve, reject) => {
        verticalDao.getVerticals().then((verticals) => {
            console.log("Verticals retrieved! {{In Service}}");
            resolve(verticals);
        }).catch((err) => {
            console.log("Failed to get verticals {{In Service}}", err);
            reject(err);
        });
    });
}

function getVerticalByName(vertical) {
    return new Promise((resolve, reject) => {
        verticalDao.getVerticalByName(vertical).then((vertical) => {
            console.log("Vertical retrieved by name! {{In Service}}");
            resolve(vertical);
        }).catch((err) => {
            console.log("Failed to get vertical by name{{In Service}}", err);
            reject(err);
        });
    });
}

module.exports = verticalService;