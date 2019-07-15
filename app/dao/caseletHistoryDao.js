var Promise = require('bluebird');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { CaseletHistory } = require('../config/sequelize');

var caseletHistoryDao = {
    getCaseletHistory,
    getCaseletHistoryById,
    addSubmittedCaselet,
    updateSubmittedCaselet,
    sendBackCaselet,
    approveCaselet
}

function getCaseletHistory(limit, pageNo, adminMid, status, fromDate) {
    return new Promise((resolve, reject) => {

        console.log("Hi from Dao");

        var whereClause = {};

        if (typeof adminMid === 'undefined' && typeof status === 'undefined' && typeof fromDate === 'undefined')
            whereClause = false;
        else {
            if (typeof adminMid !== 'undefined')
                whereClause.adminMid = adminMid;

            if (typeof status !== 'undefined')
                whereClause.status = status;

            if (typeof fromDate !== 'undefined')
                whereClause.submittedTime = {
                    [Op.between]: [fromDate, Sequelize.literal('CURRENT_TIMESTAMP')]
                }
        }

        console.log(whereClause);

        const offset = limit * (pageNo - 1);
        limit = parseInt(limit);

        CaseletHistory.findAll({
            where: whereClause,
            offset: offset,
            limit: limit,
            subQuery: false
        })
            .then((caseletHistory, err) => {
                if (!err) {
                    console.log("Caselet retrieved to Caselet History");
                    resolve(caseletHistory);
                } else {
                    console.log("Failed to get caselet to Caselet History {{In DAO}} ", err);
                    reject(new Error("Failed to get caselet to Caselet History {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to get caselet to Caselet History {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to get caselet to Caselet History {{In DAO}}"));
            });
    });
}

function getCaseletHistoryById(caseletId) {
    return new Promise((resolve, reject) => {
        CaseletHistory.findOne({
            where: {
                caseletId: caseletId,
                status: 'Sent Back'
            }
        }).then((caseletHistory, err) => {
            if (!err) {
                console.log("Caselet retrieved to Caselet History");
                resolve(caseletHistory);
            } else {
                console.log("Failed to get caselet to Caselet History {{In DAO}} ", err);
                reject(new Error("Failed to get caselet to Caselet History {{In DAO}}"));
            }
        }).catch((error) => {
            console.log("Failed to get caselet to Caselet History {{In DAO}}");
            console.log('Error', error);
            reject(new Error("Failed to get caselet to Caselet History {{In DAO}}"));
        });
    });
}

function addSubmittedCaselet(caseletId, authorMid) {
    return new Promise((resolve, reject) => {

        CaseletHistory.create({
            caseletId: caseletId,
            status: 'Submitted',
            authorMid: authorMid,
            submittedTime: Sequelize.literal('CURRENT_TIMESTAMP')
        })
            .then((caseletHistory, err) => {
                if (!err) {
                    console.log("Caselet added to Caselet History");
                    resolve(caseletHistory);
                } else {
                    console.log("Failed to add caselet to Caselet History {{In DAO}} ", err);
                    reject(new Error("Failed to add caselet to Caselet History {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to add caselet to Caselet History {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to add caselet to Caselet History {{In DAO}}"));
            });
    });
}

function updateSubmittedCaselet(caseletId, authorMid) {
    return new Promise((resolve, reject) => {
        CaseletHistory.update({
            caseletId: caseletId,
            status: 'Submitted',
            authorMid: authorMid,
            submittedTime: Sequelize.literal('CURRENT_TIMESTAMP')
        },
            {
                where:
                {
                    caseletId: caseletId, status: 'Sent Back'
                }
            })
            .then((caseletHistory, err) => {
                if (!err) {
                    console.log("Caselet updated to Caselet History");
                    resolve(caseletHistory);
                } else {
                    console.log("Failed to update caselet to Caselet History {{In DAO}} ", err);
                    reject(new Error("Failed to update caselet to Caselet History {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to update caselet to Caselet History {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to update caselet to Caselet History {{In DAO}}"));
            });
    });
}

function sendBackCaselet(caseletId, message, adminMid) {
    return new Promise((resolve, reject) => {
        CaseletHistory.update({
            caseletId: caseletId,
            status: 'Sent Back',
            adminComment: message,
            adminMid: adminMid,
            sendBackTime: Sequelize.literal('CURRENT_TIMESTAMP')
        },
            {
                where:
                {
                    caseletId: caseletId, status: 'Submitted'
                }
            })
            .then((caseletHistory, err) => {
                if (!err) {
                    console.log("Caselet updated to Caselet History");
                    resolve(caseletHistory);
                } else {
                    console.log("Failed to update caselet to Caselet History {{In DAO}} ", err);
                    reject(new Error("Failed to update caselet to Caselet History {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to update caselet to Caselet History {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to update caselet to Caselet History {{In DAO}}"));
            });
    });
}

function approveCaselet(caseletId, adminMid, pendingCaseletId) {
    return new Promise((resolve, reject) => {
        CaseletHistory.update({
            caseletId: caseletId,
            status: 'Approved',
            adminMid: adminMid,
            approvedTime: Sequelize.literal('CURRENT_TIMESTAMP')
        },
            {
                where:
                {
                    caseletId: pendingCaseletId, status: 'Submitted'
                }
            })
            .then((caseletHistory, err) => {
                if (!err) {
                    console.log("Caselet updated to Caselet History");
                    resolve(caseletHistory);
                } else {
                    console.log("Failed to update caselet to Caselet History {{In DAO}} ", err);
                    reject(new Error("Failed to update caselet to Caselet History {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to update caselet to Caselet History {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to update caselet to Caselet History {{In DAO}}"));
            });
    });
}

module.exports = caseletHistoryDao;