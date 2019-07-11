var caseletDao = require('../dao/caseletDao');
var accountDao = require('../dao/accountDao');
var customerDao = require('../dao/customerDao');
var offeringDao = require('../dao/offeringDao');
var verticalDao = require('../dao/verticalDao');
var subVerticalDao = require('../dao/subVerticalDao');
var subPracticeDao = require('../dao/subPracticeDao');
var practiceDao = require('../dao/practiceDao');
var contractDao = require('../dao/contractDao');
var tagDao = require('../dao/tagDao');
var toolDao = require('../dao/toolDao');
var technologyDao = require('../dao/technologyDao');
var pendingCaseletDao = require('../dao/pendingCaseletDao');
var caseletHistoryDao = require('../dao/caseletHistoryDao');

var adminService = {
    addProject,
    deleteProjectById,
    getCaseletsForAdmin,
    getSumbittedCaseletById,
    sendFeedback
}

function addProject(body, adminMid) {
    return new Promise((resolve, reject) => {

        pendingCaseletDao.getSavedCaseletsByUser(body.userMid)
            .then((caselet, err) => {
                if (caselet) {

                    const tags = tagDao.addTags(body.tags);
                    const technologies = technologyDao.addTechnologies(body.technologies);
                    const tools = toolDao.addTools(body.tools);

                    const customer = customerDao.addCustomer(body.customer);
                    const account = accountDao.addAccount(body.account);

                    const offering = offeringDao.getOfferingByName(body.offering);
                    const vertical = verticalDao.getVerticalByName(body.vertical);
                    const subVertical = subVerticalDao.getSubVerticalByName(body.subVertical);
                    const practice = practiceDao.getPracticeByName(body.practice);
                    const contract = contractDao.getContractByName(body.contract);

                    Promise.all([tags, technologies, tools, customer, offering, vertical, subVertical, practice, contract, account])
                        .then((values) => {

                            subPracticeDao.getSubPracticeByName(body.subPractice, values[7].dataValues.id)
                                .then((subPractice) => {

                                    console.log(values);

                                    let b = body;
                                    b.customerId = values[3].dataValues.id;
                                    b.offeringId = values[4].dataValues.id;
                                    b.verticalId = values[5].dataValues.id;
                                    b.subVerticalId = values[6].dataValues.id;
                                    b.subPracticeId = subPractice.dataValues.id;
                                    b.practiceId = values[7].dataValues.id;
                                    b.contractId = values[8].dataValues.id;
                                    b.accountId = values[9].dataValues.id;
                                    b.expertsOfTopic = body.expertsOfTopic.join();
                                
                                    console.log(b);

                                    caseletDao.addProject(b, values[0], values[1], values[2])
                                        .then((projectAdded) => {

                                            console.log("ProjectId: ",projectAdded.dataValues.id);
                                            caseletHistoryDao.approveCaselet(projectAdded.dataValues.id, adminMid, caselet.dataValues.id)
                                                .then((caseletHistory) => {
                                                    console.log("Project approved! {{In Service}}");
                                                    pendingCaseletDao.deletePendingCaselet(b.userMid);
                                                    resolve(projectAdded);
                                                });
                                        }).catch((err) => {
                                            console.log("Failed to approve project {{In Service}}", err);
                                            reject(err);
                                        });
                                }).catch((err) => {
                                    console.log("Failed to approve project {{In Service}}", err);
                                    reject(err);
                                });
                        });
                }
                else {
                    console.log("Project does not exist in Pending Project table. Failed to approve project {{In Service}}", err);
                    reject(err);
                }
            }).catch((err) => {
                console.log("Failed to approve project {{In Service}}", err);
                reject(err);
            });
    });
}

function deleteProjectById(projectId) {
    return new Promise((resolve, reject) => {
        caseletDao.deleteProjectById(projectId).then((deleteResponse) => {
            console.log("Project deleted! {{In Service}}");
            resolve(deleteResponse);
        }).catch((err) => {
            console.log("Failed to delete project {{In Service}}", err);
            reject(err);
        });
    });
}

function getCaseletsForAdmin(limit, pageNo) {
    return new Promise((resolve, reject) => {

        caseletHistoryDao.getCaseletHistory(limit, pageNo)
            .then((caseletHistory) => {
                var approvedCaselets = [];
                var pendingCaselets = [];

                console.log(caseletHistory);

                caseletHistory.map((caselet) => {
                    console.log("Caselet Map: ", caselet.dataValues);

                    if (caselet.dataValues.status == 'Approved') {
                        approvedCaselets.push(parseInt(caselet.dataValues.caseletId));
                    }
                    else {
                        pendingCaselets.push(parseInt(caselet.dataValues.caseletId));
                    }
                });

                console.log("ApprovedCaselets: ", approvedCaselets);
                console.log("PendingCaselets: ", pendingCaselets);

                var a = caseletDao.getTitles(approvedCaselets);
                var p = pendingCaseletDao.getTitles(pendingCaselets);

                Promise.all([a, p])
                    .then((values) => {

                        caseletHistory.map((caselet) => {
                            if (caselet.dataValues.status == 'Approved') {
                                var res = values[0].find(o => o.dataValues.id === caselet.dataValues.caseletId);
                                caselet.dataValues.title = res.dataValues.title;
                            }
                            else {
                                var res = values[1].find(o => o.dataValues.id === caselet.dataValues.caseletId);
                                caselet.dataValues.title = res.dataValues.title;
                            }
                        });

                        resolve(caseletHistory);
                    });
            });
    });
}

function getSumbittedCaseletById(caseletId) {
    return new Promise((resolve, reject) => {
        pendingCaseletDao.getSumbittedCaseletById(caseletId)
            .then((project) => {
                console.log("Sumbitted Project retrieved by ID! {{In Service}}");
                resolve(project);
            }).catch((err) => {
                console.log("Failed to get submitted project by ID {{In Service}}", err);
                reject(err);
            });
    });
}

function sendFeedback(pendingCaseletId, message, adminMid) {
    return new Promise((resolve, reject) => {
        const pendingCaselet = pendingCaseletDao.sendFeedback(pendingCaseletId);
        const caseletHistory = caseletHistoryDao.sendBackCaselet(pendingCaseletId, message, adminMid);

        Promise.all([pendingCaselet, caseletHistory])
            .then((project) => {
                console.log("Pending Projects feedback sent! {{In Service}}");
                resolve(project);
            }).catch((err) => {
                console.log("Failed to send pending projects feedback {{In Service}}", err);
                reject(err);
            });
    })
}

module.exports = adminService;