const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const {
    User,
    Tool,
    Tag,
    Technology,
    Offering,
    SubVertical,
    SubPractice,
    Account,
    Vertical,
    Practice,
    Contract,
    Customer,
    Project
} = require('../config/sequelize');

var caseletDao = {
    getTitles,
    getResults,
    addProject,
    getProjectById,
    deleteProjectById,
    likeProject,
    getLikedProject,
    dislikeProject,
    shareProject,
    downloadProject,
    getMostLikedProjects,
    getMostSharedProjects,
    getMostDownloadededProjects,
    getMostViewedProjects,
    getProjectByProjectId,
    getProjectIdByPagination
}

function getTitles(projectIds) {
    return new Promise((resolve, reject) => {
        Project.findAll({
            where: {
                id: {
                    [Op.in]: projectIds
                }
            },
            attributes: ['id', 'title']
        })
            .then((project, err) => {
                if (!err) {
                    console.log("Project Titles retrieved{{In DAO}}");
                    resolve(project);
                } else {
                    console.log("Failed to get project titles {{In DAO}} ", err);
                    reject(new Error("Failed to get project titles {{In DAO}}"));
                }
            }).catch((error) => {
                console.error('Error', error);
                reject(new Error("Failed to get project titles {{In DAO}}"));
            });
    })
}

function getProjectIdByPagination(limit, pageNo) {
    return new Promise((resolve, reject) => {
        const offset = limit * (pageNo - 1);
        console.log('Reached!');
        console.log(offset);
        console.log(limit);
        limit = parseInt(limit);
        Project.findAll({
            attributes: [ 'id' ],
            offset: offset,
            limit: limit,
            subQuery: false
        }).then((project, err) => {
            if (!err) {
                console.log("Project Ids retrieved by Page No {{In DAO}}");
                    resolve(project);
            } else {
                console.log("Failed to get project ids by page no {{In DAO}} ", err);
                reject(new Error("Failed to get project ids by page no {{In DAO}}"));
                }
            }).catch((error) => {
                console.error('Error', error);
                reject(new Error("Failed to get project ids by page no {{In DAO}}"));
            });
    });
}

function getResults(projectIds, userMid, pageNo, limit) {
    return new Promise((resolve, reject) => {

        Project.findAll({
            where: {
                id: {
                    [Op.in]: projectIds
                }
            },
            attributes: { exclude: ['projectDetails', 'challenges', 'solution', 'benefits', 'executionSummary', 'expertsOfTopic', 'offeringId', 'subVerticalId', 'serviceId', 'accountId', 'verticalId', 'practiceId', 'contractId', 'customerId'] },
            include: [Technology, Tool, Offering, Tag, SubVertical, SubPractice, Account, Vertical, Practice, Contract,
                {
                    model: Customer,
                    attributes: { include: ['id', 'name'], exclude: ['details'] }
                },
                {
                    model: User,
                    as: 'likes',
                    where: { mid: userMid },
                    required: false
                }
            ],
            offset: (parseInt(pageNo, 10) - 1) * parseInt(limit, 10),
            limit: parseInt(limit, 10),
            subQuery: false
        })
            .then((project, err) => {
                if (!err) {
                    console.log("Projects retrieved{{In DAO}}");
                    resolve(project);
                } else {
                    console.log("Failed to get projects {{In DAO}} ", err);
                    reject(new Error("Failed to get projects {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to get projects {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to get projects {{In DAO}}"));
            });
    });
}

function addProject(body, tags, technologies, tools) {
    return new Promise((resolve, reject) => {
        Project.create(body)
            .then(async (project) => Promise.all(tags).then(storedTags => project.addTags(storedTags)).then(() => project))
            .then(async (project) => Promise.all(technologies).then(storedTechnologies => project.addTechnologies(storedTechnologies)).then(() => project))
            .then(async (project) => Promise.all(tools).then(storedTools => project.addTools(storedTools)).then(() => project))
            .then(async (project) => Project.findByPk(project.id, {
                include: [Technology, Tool, Offering, Tag, SubVertical, SubPractice, Account, Vertical, Practice, Contract, Customer]
            }))
            .then(async (projectWithAssociation, err) => {
                if (!err) {
                    console.log("Project added {{In DAO}}");
                    resolve(projectWithAssociation);
                } else {
                    console.log("Failed to add project {{In DAO}} ", err);
                    reject(err);
                }
            }).catch((error) => {
                console.log("Failed to add project {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to add project {{In DAO}}"));
            });
    });
}

function getProjectById(projectId) {
    console.log('Project Id', projectId);
    return new Promise((resolve, reject) => {
        Project.findByPk(projectId, {
            include: [Technology, Tool, Offering, Tag, SubVertical, SubPractice, Account, Vertical, Practice, Contract, Customer]
        })
            .then((project, err) => {
                if (!err) {
                    console.log(project);
                    return project.increment('view_count', { by: 1 })
                } else {
                    console.log("Failed to get project by id {{In DAO}} ", err);
                    reject(new Error("Failed to get project by id {{In DAO}}"));
                }
            })
            .then((project, err) => {
                if (!err) {
                    console.log("Project retrieved by id {{In DAO}}");
                    resolve(project);
                } else {
                    console.log("Failed to get project by id {{In DAO}} ", err);
                    reject(new Error("Failed to get project by id {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to get project by id {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to get project by id {{In DAO}}"));
            });
    });
}

function getProjectByProjectId(projectId) {
    return new Promise((resolve, reject) => {
        Project.findByPk(projectId, {
            attributes: ['id', 'title']
        })
            .then((project, err) => {
                if (!err) {
                    console.log("Project retrieved by id {{In DAO}}");
                    resolve(project);
                } else {
                    console.log("Failed to get project by id {{In DAO}} ", err);
                    reject(new Error("Failed to get project by id {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to get project by id {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to get project by id {{In DAO}}"));
            });
    });
}

function likeProject(project, user) {
    return new Promise((resolve, reject) => {
        user.addLike(project)
            .then(async () => {
                project.increment('like')
                    .then((project, err) => {
                        if (!err) {
                            console.log("Project liked by id {{In DAO}}");
                            resolve(project);
                        } else {
                            console.log("Failed to increment like count of project by id {{In DAO}} ", err);
                            reject(new Error("Failed to increment like count of project by id {{In DAO}}"));
                        }
                    }).catch((error) => {
                        console.log("Failed to increment like count of project by id {{In DAO}}");
                        console.log('Error', error);
                        reject(new Error("Failed to increment like count of project by id {{In DAO}}"));
                    });
            }).catch((error) => {
                console.log("Failed to like project by id {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to like project by id {{In DAO}}"));
            });
    });
}

function getLikedProject(projectId, userMid) {
    return new Promise((resolve, reject) => {

        Project.findByPk(projectId, {
            attributes: ['id', 'title'],
            include: [{
                model: User,
                as: 'likes',
                where: { mid: userMid },
                required: false
            }]
        })
            .then((project, err) => {
                if (!err) {
                    console.log("Project retrieved by id {{In DAO}}");
                    resolve(project);
                } else {
                    console.log("Failed to get project by id {{In DAO}} ", err);
                    reject(new Error("Failed to get project by id {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to get project by id {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to get project by id {{In DAO}}"));
            });
    });
}

function dislikeProject(project, user) {
    return new Promise((resolve, reject) => {
        user.removeLike(project)
            .then(async () => {
                project.decrement('like')
                    .then((project, err) => {
                        if (!err) {
                            console.log("Project disliked by id {{In DAO}}");
                            resolve(project);
                        } else {
                            console.log("Failed to decrement like count of project by id {{In DAO}} ", err);
                            reject(new Error("Failed to decrement like count of project by id {{In DAO}}"));
                        }
                    }).catch((error) => {
                        console.log("Failed to decrement like count of project by id {{In DAO}}");
                        console.log('Error', error);
                        reject(new Error("Failed to decrement like count of project by id {{In DAO}}"));
                    });
            }).catch((error) => {
                console.log("Failed to dislike project by id {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to dislike project by id {{In DAO}}"));
            });
    });
}

function shareProject(projectId, count) {
    return new Promise((resolve, reject) => {

        Project.increment('share', { by: count, where: { id: projectId } })
            .then(async () => Project.findByPk(projectId, {
                include: [Technology, Tool, Offering, Tag, SubVertical, SubPractice, Account, Vertical, Practice, Contract, Customer,]
            }))
            .then((project, err) => {
                if (!err) {
                    console.log("Project share count incremented by id {{In DAO}}");
                    resolve(project);
                } else {
                    console.log("Failed to increment share count of project by id {{In DAO}} ", err);
                    reject(new Error("Failed to increment share count of project by id {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to increment share count of project by id {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to increment share count of project by id {{In DAO}}"));
            });

    });
}

function downloadProject(projectId) {
    return new Promise((resolve, reject) => {

        Project.increment('download', { where: { id: projectId } })
            .then(async () => Project.findByPk(projectId, {
                include: [Technology, Tool, Offering, Tag, SubVertical, SubPractice, Account, Vertical, Practice, Contract, Customer]
            }))
            .then((project, err) => {
                if (!err) {
                    console.log("Project download count incremented by id {{In DAO}}");
                    resolve(project);
                } else {
                    console.log("Failed to increment download count of project by id {{In DAO}} ", err);
                    reject(new Error("Failed to increment download count of project by id {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to increment download count of project by id {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to increment download count of project by id {{In DAO}}"));
            });

    });
}

function getMostLikedProjects() {
    return new Promise((resolve, reject) => {
        Project.findAll({
            order: [["like", "DESC"]],
            limit: 3,
            attributes: ['id', 'title', 'coverImage', 'userMid']
        })
            .then((project, err) => {
                if (!err) {
                    console.log("Most Liked projects retrieved {{In DAO}}");
                    resolve(project);
                } else {
                    console.log("Failed to get most liked projects {{In DAO}} ", err);
                    reject(new Error("Failed to get most liked projects {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to get most liked projects {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to get most liked projects {{In DAO}}"));
            });
    });
}

function getMostSharedProjects() {
    return new Promise((resolve, reject) => {
        Project.findAll({
            order: [["share", "DESC"]],
            limit: 3,
            attributes: ['id', 'title', 'coverImage', 'userMid']
        })
            .then((project, err) => {
                if (!err) {
                    console.log("Most shared projects retrieved {{In DAO}}");
                    resolve(project);
                } else {
                    console.log("Failed to get most shared projects {{In DAO}} ", err);
                    reject(new Error("Failed to get most shared projects {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to get most shared projects {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to get most shared projects {{In DAO}}"));
            });
    });
}

function getMostDownloadededProjects() {
    return new Promise((resolve, reject) => {
        Project.findAll({
            order: [["download", "DESC"]],
            limit: 3,
            attributes: ['id', 'title', 'coverImage', 'userMid']
        })
            .then((project, err) => {
                if (!err) {
                    console.log("Most downloaded projects retrieved {{In DAO}}");
                    resolve(project);
                } else {
                    console.log("Failed to get most downloaded projects {{In DAO}} ", err);
                    reject(new Error("Failed to get most downloaded projects {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to get most downloaded projects {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to get most downloaded projects {{In DAO}}"));
            });
    });
}

function getMostViewedProjects() {
    return new Promise((resolve, reject) => {
        Project.findAll({
            order: [["viewCount", "DESC"]],
            limit: 3,
            attributes: ['id', 'title', 'coverImage', 'userMid']
        })
            .then((project, err) => {
                if (!err) {
                    console.log("Most viewed projects retrieved {{In DAO}}");
                    resolve(project);
                } else {
                    console.log("Failed to get most viewed projects {{In DAO}} ", err);
                    reject(new Error("Failed to get most viewed projects {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to get most viewed projects {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to get most viewed projects {{In DAO}}"));
            });
    });
}

function deleteProjectById(projectId) {
    return new Promise((resolve, reject) => {
        Project.destroy({
            where: { id: projectId }
        })
            .then((deleteResponse, err) => {
                if (!err) {
                    console.log("Project deleted by id {{In DAO}}");
                    resolve(deleteResponse);
                } else {
                    console.log("Failed to delete project by id {{In DAO}} ", err);
                    reject(new Error("Failed to delete project by id {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to delete project by id {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to delete project by id {{In DAO}}"));
            });
    });
}

module.exports = caseletDao;