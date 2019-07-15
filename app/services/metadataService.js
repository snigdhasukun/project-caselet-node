var Promise = require('bluebird');

var accountDao = require('../dao/accountDao');
var subVerticalDao = require('../dao/subVerticalDao');
var subPracticeDao = require('../dao/subPracticeDao');
var offeringDao = require('../dao/offeringDao');
var technologyDao = require('../dao/technologyDao');
var toolDao = require('../dao/toolDao');
var tagDao = require('../dao/tagDao');
var verticalDao = require('../dao/verticalDao');
var contractDao = require('../dao/contractDao');
var practiceDao = require('../dao/practiceDao');

var metadataService = {
    getMetadata
}

function getMetadata() {
    return new Promise((resolve, reject) => {

        const account = accountDao.getAccounts();
        const subVertical = subVerticalDao.getSubVerticals();
        const offering = offeringDao.getOfferings();
        const subPractice = subPracticeDao.getSubPractices();
        const technology = technologyDao.getTechnologies();
        const tool = toolDao.getTools();
        const tag = tagDao.getTags();
        const vertical = verticalDao.getVerticals();
        const contract = contractDao.getContracts();
        const practice = practiceDao.getPractices();

        Promise.all([account, subVertical, offering, subPractice, technology, tool, tag, vertical, contract, practice])
            .then((values) => {
                let metadata = {};
                metadata.contracts = values[8];
                metadata.practice = values[9];
                metadata.verticals = values[7];
                metadata.offerings = values[2];
                metadata.subPractices = values[3];
                metadata.subVerticals = values[1];
                metadata.technologies = values[4];
                metadata.tools = values[5];
                metadata.tag = values[6];
                metadata.accounts = values[0];

                console.log("Metadata retrieved! {{In Service}}");
                resolve(metadata);
            })
            .catch((err) => {
                console.log("Failed to get metadata {{In Service}}", err);
                reject(err);
            });
    });
}

module.exports = metadataService;