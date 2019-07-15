var Promise = require('bluebird');

var subVerticalDao = require('../dao/subVerticalDao');
var subPracticeDao = require('../dao/subPracticeDao');
var offeringDao = require('../dao/offeringDao');
var verticalDao = require('../dao/verticalDao');
var practiceDao = require('../dao/practiceDao');

var filterService = {
    getFilters
}

function getFilters() {
    return new Promise((resolve, reject) => {

        const subVertical = subVerticalDao.getSubVerticals();
        const offering = offeringDao.getOfferings();
        const subPractice = subPracticeDao.getSubPractices();
        const vertical = verticalDao.getVerticals();
        const practice = practiceDao.getPractices();

        Promise.all([vertical, subVertical, offering, practice, subPractice])
            .then((values) => {
                let filters = {};
                
                filters.verticals = values[0];
                filters.subVerticals = values[1];
                filters.offerings = values[2];
                filters.practice = values[3];
                filters.subPractices = values[4];
                
                console.log("Filterss retrieved! {{In Service}}");
                resolve(filters);
            })
            .catch((err) => {
                console.log("Failed to get filters {{In Service}}", err);
                reject(err);
            });
    });
}

module.exports = filterService;