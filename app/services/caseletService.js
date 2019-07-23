var Promise = require('bluebird');
const puppeeter = require('puppeteer');
var AzureSearch = require('azure-search');
var searchConfig = require('../config/searchConfig');
var sendEmail = require('../util/mailer');

var caseletDao = require('../dao/caseletDao');
var userDao = require('../dao/userDao');
var pendingCaseletDao = require('../dao/pendingCaseletDao');
var activityLogDao = require('../dao/activityLogDao');
var caseletHistoryDao = require('../dao/caseletHistoryDao');

var template = require('../templates/downloadTemplate');

var caseletService = {
    getProjects,
    getProjectById,
    likeProject,
    shareProject,
    downloadProject,
    getMostLikedProjects,
    getMostSharedProjects,
    getMostDownloadededProjects,
    getMostViewedProjects,
    addPendingCaselet,
    getSavedCaseletsByUser,
    searchAndFilterCaselet
}

function getProjects(userMid, pageNo, limit) {
    return new Promise((resolve, reject) => {
        console.log(pageNo);
        console.log(limit);
        caseletDao.getProjectIdByPagination(limit, pageNo)
            .then((project) => {
                const ids = project.map(res => parseInt(res.dataValues.id));
                console.log(ids);
                caseletDao.getResults(ids, userMid)
                    .then((result) => {

                        var caselets = result.map(res => {
                            if (res.dataValues.likes.length == 0)
                                res.dataValues.liked = false
                            else
                                res.dataValues.liked = true;

                            return res;
                        });

                        console.log("Projects retrieved! {{In Service}}");
                        resolve(caselets);
                    })
                    .catch((err) => {
                        console.log("Failed to get projects {{In Service}}", err);
                        reject(err);
                    });
            })
            .catch((err) => {
                console.log("Failed to get projects {{In Service}}", err);
                reject(err);
            });

    });
}

function addPendingCaselet(body, userMid) {
    return new Promise((resolve, reject) => {

        pendingCaseletDao.getSavedCaseletsByUser(userMid)
            .then((caselet) => {
                if (caselet) {

                    let b = body;
                    console.log('Service', b);
                    b.tags = body.tags.join();
                    b.technologies = body.technologies.join();
                    b.tools = body.tools.join();
                    b.customerName = body.customer.name;
                    b.customerDetails = body.customer.details;
                    console.log(b.customerName);
                    b.expertsOfTopic = body.expertsOfTopic.join();

                    pendingCaseletDao.updatePendingCaselet(b, userMid)
                        .then((caselet) => {

                            if (b.submit == true) {
                                caseletHistoryDao.getCaseletHistoryById(caselet.dataValues.id)
                                    .then((data) => {
                                        if (data) {
                                            caseletHistoryDao.updateSubmittedCaselet(caselet.dataValues.id, userMid)
                                                .then((caseletHistory) => {
                                                    console.log("Pending Caselet updated! {{In Service}}");
                                                    resolve(caselet);
                                                });
                                        }
                                        else {
                                            caseletHistoryDao.addSubmittedCaselet(caselet.dataValues.id, userMid)
                                                .then((caseletHistory) => {
                                                    console.log("Pending Caselet updated! {{In Service}}");
                                                    resolve(caselet);
                                                });
                                        }
                                    });
                            }
                            else {
                                console.log("Pending Caselet updated! {{In Service}}");
                                resolve(caselet);
                            }
                        }).catch((err) => {
                            console.log("Failed to update pending caselet {{In Service}}", err);
                            reject(err);
                        });
                }
                else {

                    let b = body;
                    b.userMid = userMid;
                    b.tags = body.tags.join();
                    b.technologies = body.technologies.join();
                    b.tools = body.tools.join();
                    b.customerName = body.customer.name;
                    b.customerDetails = body.customer.details;
                    b.expertsOfTopic = body.expertsOfTopic.join();

                    console.log(b);

                    pendingCaseletDao.addPendingCaselet(b)
                        .then((projectAdded) => {

                            if (b.submit == true) {
                                caseletHistoryDao.addSubmittedCaselet(projectAdded.dataValues.id, userMid)
                                    .then((caseletHistory) => {
                                        console.log("Pending Caselet added! {{In Service}}");
                                        resolve(projectAdded);
                                    })
                            }
                            else {
                                console.log("Pending Caselet added! {{In Service}}");
                                resolve(projectAdded);
                            }

                        }).catch((err) => {
                            console.log("Failed to add pending caselet {{In Service}}", err);
                            reject(err);
                        });
                }
            }).catch((err) => {
                console.log("Failed to add/update pending caselet {{In Service}}", err);
                reject(err);
            });
    });
}

function getSavedCaseletsByUser(userMid) {
    return new Promise((resolve, reject) => {
        pendingCaseletDao.getSavedCaseletsByUser(userMid)
            .then((project) => {
                console.log("Saved Project retrieved! {{In Service}}");
                resolve(project);
            }).catch((err) => {
                console.log("Failed to get saved project {{In Service}}", err);
                reject(err);
            });
    });
}

function getProjectById(projectId, userMid) {
    return new Promise((resolve, reject) => {
        caseletDao.getProjectById(projectId)
            .then((project) => {
                activityLogDao.addEvent("View", userMid, projectId)
                    .then((event) => {
                        console.log("Project retrieved! {{In Service}}");
                        resolve(project);
                    });
            }).catch((err) => {
                console.log("Failed to get project {{In Service}}", err);
                reject(err);
            });
    });
}

function likeProject(projectId, userMid) {
    return new Promise((resolve, reject) => {

        const projects = caseletDao.getProjectByProjectId(projectId);
        const users = userDao.getUserByMid(userMid);
        const likedProject = caseletDao.getLikedProject(projectId, userMid);

        Promise.all([likedProject, projects, users])
            .then((values) => {
                console.log("Liked Project: ", values[0].likes.length);

                if (values[0].likes.length == 0) {
                    caseletDao.likeProject(values[1], values[2])
                        .then((project) => {
                            activityLogDao.addEvent("Like", userMid, projectId)
                                .then((event) => {
                                    console.log("Project liked! {{In Service}}");
                                    resolve(project);
                                });
                        }).catch((err) => {
                            console.log("Failed to like project {{In Service}}", err);
                            reject(err);
                        });
                }
                else {
                    caseletDao.dislikeProject(values[0], values[2])
                        .then((project) => {
                            activityLogDao.addEvent("Dislike", userMid, projectId)
                                .then((event) => {
                                    console.log("Project disliked! {{In Service}}");
                                    resolve(project);
                                });
                        }).catch((err) => {
                            console.log("Failed to dislike project {{In Service}}", err);
                            reject(err);
                        });
                }
            }).catch((err) => {
                console.log("Failed to like/dislike project {{In Service}}", err);
                reject(err);
            });

    });
}

function shareProject(projectId, from, body) {
    return new Promise((resolve, reject) => {

        var to = body.to;
        console.log(body);
        var data = body;
        data.projectId = projectId;

        const mails = to.map(emailTo => {
            return sendEmail('share', from.name, emailTo, data);
        });

        Promise.all(mails)
            .then((values) => {
                caseletDao.shareProject(projectId, to.length)
                    .then((project) => {
                        activityLogDao.addEvent("Share", from.mid, projectId)
                            .then((event) => {
                                console.log("Project shared! {{In Service}}");
                                resolve(project);
                            });
                    }).catch((err) => {
                        console.log("Failed to share project {{In Service}}", err);
                        reject(err);
                    });
            }).catch((err) => {
                console.log("Failed to share project {{In Service}}", err);
                reject(err);
            });
    });
}

function downloadProject(projectId, userMid) {
    return new Promise((resolve, reject) => {
        caseletDao.getProjectById(projectId).then((response) => {
            // caseletDao.downloadProject(projectId)
            // .then((project) => {
            //     activityLogDao.addEvent("Download", userMid, projectId)
            //         .then((event) => {
            //             console.log("Project downloaded! {{In Service}}");
            //             resolve(project);
            // //         });
            // }).catch((err) => {
            //     console.log("Failed to download project {{In Service}}", err);
            //     reject(err);
            // });
            downloadTemplate(response).then((pdf) => {
                // console.log(pdf);
                resolve(pdf);
            });
            // resolve(response);
        });
    });
}

function getMostLikedProjects() {
    return new Promise((resolve, reject) => {
        caseletDao.getMostLikedProjects().then((project) => {
            console.log("Most Liked projects retrieved! {{In Service}}");
            resolve(project);
        }).catch((err) => {
            console.log("Failed to get most liked projects {{In Service}}", err);
            reject(err);
        });
    });
}

function getMostSharedProjects() {
    return new Promise((resolve, reject) => {
        caseletDao.getMostSharedProjects().then((project) => {
            console.log("Most shared projects retrieved! {{In Service}}");
            resolve(project);
        }).catch((err) => {
            console.log("Failed to get most shared projects {{In Service}}", err);
            reject(err);
        });
    });
}

function getMostDownloadededProjects() {
    return new Promise((resolve, reject) => {
        caseletDao.getMostDownloadededProjects()
            .then((project) => {
                console.log("Most downloaded projects retrieved! {{In Service}}");
                resolve(project);
            }).catch((err) => {
                console.log("Failed to get most downloaded projects {{In Service}}", err);
                reject(err);
            });
    });
}

function getMostViewedProjects() {
    return new Promise((resolve, reject) => {
        caseletDao.getMostViewedProjects()
            .then((project) => {
                console.log("Most viewed projects retrieved! {{In Service}}");
                resolve(project);
            }).catch((err) => {
                console.log("Failed to get most viewed projects {{In Service}}", err);
                reject(err);
            });
    });
}

function searchAndFilterCaselet(searchValue, filterValue, pageNo, limit, userMid) {
    return new Promise((resolve, reject) => {
        var client = AzureSearch({
            url: searchConfig.searchUrl,
            key: searchConfig.queryKey
        });

        client.search(searchConfig.index, { search: searchValue, filter: filterValue }, (err, results) => {
            if (!err) {

                console.log(results);

                var searchIds = results.map(result =>
                    parseInt(result.project_id)
                );

                console.log(searchIds);
                var uniqueSearchIds = new Set(searchIds);
                var ids = Array.from(uniqueSearchIds);

                console.log(ids);

                var resultIds;
                if ((typeof pageNo != "undefined" && pageNo.length != 0) && (typeof limit != "undefined" && limit.length != 0)) {
                    console.log("If: ");
                    console.log(pageNo);
                    console.log(limit);
                    resultIds = ids.slice(limit * (pageNo - 1), limit * pageNo);
                }
                else {
                    console.log("Else: ");
                    console.log(pageNo);
                    console.log(limit);
                    resultIds = ids;
                }

                console.log(resultIds);

                caseletDao.getResults(resultIds, userMid)
                    .then((result) => {

                        var caselets = result.map(res => {
                            if (res.dataValues.likes.length == 0)
                                res.dataValues.liked = false
                            else
                                res.dataValues.liked = true;

                            return res;
                        });

                        var caselet = caselets.sort((a, b) => {
                            return searchIds.indexOf(a.dataValues.id) - searchIds.indexOf(b.dataValues.id);
                        });

                        caselet.map(s => console.log(s.dataValues.id));

                        console.log("Projects retrieved! {{In Service}}");
                        resolve(caselet);
                    })
                    .catch((err) => {
                        console.log("Failed to get projects {{In Service}}", err);
                        reject(err);
                    });
            }
            else {
                console.log("Failed to search projects {{In Service}} ", err);
                reject(new Error("Failed to search projects {{In Service}}"));
            }
        });
    });
}

async function downloadTemplate(caselet) {
    const templateCreated = template.createTemplate(caselet);
    try {
        const browser = await puppeeter.launch();
        const page = await browser.newPage();
        await page.setContent(templateCreated, {
            waitUntil: 'networkidle0'
        });
        // await page.emulateMedia('screen');
        const pdf = await page.pdf({
            // path: 'mypdf.pdf',
            format: 'A4',
            margin: { top: 20, bottom: 50, right: 10, left: 10 },
            footerTemplate: `<div style = "width: 100%; text-align: center; font-size: 8px;">
                <hr>
                <div style = "width: 100%; text-align: center">
                Page <span class='pageNumber'></span> 
                OF <span class='totalPages'></span></div></div>`,
            displayHeaderFooter: true,
            printBackground: true
        });
        await browser.close();
        return pdf;
    } catch (e) {
        console.log('error', e);
    }
}


module.exports = caseletService;