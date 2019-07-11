var Promise = require('bluebird');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { PendingCaselet, User } = require('../config/sequelize');

var pendingCaseletDao = {
    addPendingCaselet,
    updatePendingCaselet,
    deletePendingCaselet,
    getSavedCaseletsByUser,
    getSumbittedCaseletById,
    sendFeedback,
    getTitles
}

function getTitles(projectIds) {
    return new Promise((resolve, reject) => {
        console.log("Hello from PendingCaseletDao");
        PendingCaselet.findAll({
            where: {
                id: {
                    [Op.in]: projectIds
                }
            },
            attributes: ['id', 'title']
        })
            .then((pendingCaselet, err) => {
                if (!err) {
                    console.info(pendingCaselet);
                    console.log("Sumbitted Project Titles retrieved{{In DAO}}");
                    resolve(pendingCaselet);
                } else {
                    console.log("Failed to get submitted project titles {{In DAO}} ", err);
                    reject(new Error("Failed to get submitted project titles {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to get submitted project titles {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to get submitted project titles {{In DAO}}"));
            });
    })
}

function getSavedCaseletsByUser(userMid) {
    return new Promise((resolve, reject) => {
        PendingCaselet.findOne({
            where: { userMid: userMid }
        })
            .then((pendingCaselet, err) => {
                if (!err) {
                    console.log("Saved Projects retrieved by User {{In DAO}}");
                    resolve(pendingCaselet);
                } else {
                    console.log("Failed to get saved projects by user {{In DAO}} ", err);
                    reject(new Error("Failed to get saved projects by user {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to get saved projects by user {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to get saved projects by user {{In DAO}}"));
            });
    });
}

function getSumbittedCaseletById(caseletId) {
    return new Promise((resolve, reject) => {
        PendingCaselet.findOne({
            where: { id: caseletId, submit: true }
        })
            .then((pendingCaselet, err) => {
                if (!err) {
                    console.log("Saved Projects retrieved by Id {{In DAO}}");
                    resolve(pendingCaselet);
                } else {
                    console.log("Failed to get saved projects by Id {{In DAO}} ", err);
                    reject(new Error("Failed to get saved projects by Id {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to get saved projects by Id {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to get saved projects by Id {{In DAO}}"));
            });
    });
}

function addPendingCaselet(pendingCaselet) {
    return new Promise((resolve, reject) => {
        PendingCaselet.create(pendingCaselet)
            .then(async (caselet) => PendingCaselet.findByPk(caselet.id))
            .then((caselet, err) => {
                if (!err) {
                    console.log("New pending caselet added {{In DAO}}");
                    resolve(caselet);
                } else {
                    console.log("Failed to add pending caselet {{In DAO}} ", err);
                    reject(new Error("Failed to add pending caselet {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to add pending caselet {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to add pending caselet {{In DAO}}"));
            });
    })
}

function updatePendingCaselet(pendingCaselet, userMid) {
    return new Promise((resolve, reject) => {
        PendingCaselet.update(pendingCaselet, { where: { userMid: userMid } })
            .then(async () => PendingCaselet.findOne({ where: { title: pendingCaselet.title } }))
            .then((pendingCaselet, err) => {
                if (!err) {
                    console.log("Pending Caselet updated {{In DAO}}");
                    resolve(pendingCaselet);
                } else {
                    console.log("Failed to update pending caselet{{In DAO}} ", err);
                    reject(new Error("Failed to update pending caselet{{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to update pending caselet{{In DAO}}")
                console.log('Error', error);
                reject(new Error("Failed to update pending caselet{{In DAO}}"));
            });
    });
}

function deletePendingCaselet(userMid) {
    return new Promise((resolve, reject) => {
        PendingCaselet.destroy({ where: { userMid: userMid } })
            .then((deleteResponse, err) => {
                if (!err) {
                    console.log("Pending caselet deleted {{In DAO}}");
                    resolve(deleteResponse);
                } else {
                    console.log("Failed to delete  pending caselet {{In DAO}} ", err);
                    reject(new Error("Failed to delete  pending caselet {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to delete  pending caselet {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to delete  pending caselet {{In DAO}}"));
            });
    });
}

function sendFeedback(pendingCaseletId) {
    return new Promise((resolve, reject) => {
        PendingCaselet.update({ submit: false}, { where: { id: pendingCaseletId } })
            .then(async () => PendingCaselet.findOne({ where: { id: pendingCaseletId } }))
            .then((pendingCaselet, err) => {
                if (!err) {
                    console.log("Pending Caselet feedback sent {{In DAO}}");
                    resolve(pendingCaselet);
                } else {
                    console.log("Failed to send pending caselet feedback {{In DAO}} ", err);
                    reject(new Error("Failed to send pending caselet feedback {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to send pending caselet feedback {{In DAO}}")
                console.log('Error', error);
                reject(new Error("Failed to send pending caselet feedback {{In DAO}}"));
            });
    })
}

module.exports = pendingCaseletDao;