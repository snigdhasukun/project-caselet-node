var Promise = require('bluebird');

var offeringDao = require('../dao/offeringDao');


var offeringService = {
    addOffering,
    getOfferings,
    getOfferingByName
}

function addOffering(offering) {
    return new Promise((resolve, reject) => {
        offeringDao.addOffering(offering).then((offering) => {
            console.log("Offering added! {{In Service}}");
            resolve(offering);
        }).catch((err) => {
            console.log("Failed to add offering {{In Service}}", err);
            reject(err);
        });
    });
}

function getOfferings() {
    return new Promise((resolve, reject) => {
        offeringDao.getOfferings().then((offerings) => {
            console.log("Offerings retrieved! {{In Service}}");
            resolve(offerings);
        }).catch((err) => {
            console.log("Failed to get offerings {{In Service}}", err);
            reject(err);
        });
    });
}

function getOfferingByName(offering) {
    return new Promise((resolve, reject) => {
        offeringDao.getOfferingByName(offering).then((offering) => {
            console.log("Offering retrieved by name! {{In Service}}");
            resolve(offering);
        }).catch((err) => {
            console.log("Failed to get offering by name {{In Service}}", err);
            reject(err);
        });
    });
}

module.exports = offeringService;