var Promise = require('bluebird');

var subVerticalDao = require('../dao/subVerticalDao');


var subVerticalService = {
    addSubVertical,
    getSubVerticals,
    getSubVerticalByName
}

function addSubVertical(subVertical) {
    return new Promise((resolve, reject) => {
        subVerticalDao.addSubVertical(subVertical).then((subVertical) => {
            console.log("SubVertical added! {{In Service}}");
            resolve(subVertical);
        }).catch((err) => {
            console.log("Failed to add subVertical {{In Service}}", err);
            reject(err);
        });
    });
}

function getSubVerticals() {
    return new Promise((resolve, reject) => {
        subVerticalDao.getSubVerticals().then((subVerticals) => {
            console.log("SubVerticals retrieved! {{In Service}}");
            resolve(subVerticals);
        }).catch((err) => {
            console.log("Failed to get subVerticals {{In Service}}", err);
            reject(err);
        });
    });
}

function getSubVerticalByName(subVertical) {
    return new Promise((resolve, reject) => {
        subVerticalDao.getSubVerticalByName(subVertical).then((subVertical) => {
            console.log("SubVertical retrieved by name! {{In Service}}");
            resolve(subVertical);
        }).catch((err) => {
            console.log("Failed to get subVertical by name {{In Service}}", err);
            reject(err);
        });
    });
}

module.exports = subVerticalService;