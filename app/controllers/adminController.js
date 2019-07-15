var Response = require("../util/response");
var adminService = require('../services/adminService');

var adminController = {
    addProject,
    deleteProjectById,
    getCaseletsForAdmin,
    getSumbittedCaseletById,
    sendFeedback,
    getAllAdmins
}

function addProject(req, res) {
    var response = new Response();

    var body = req.body;

    adminService.addProject(body, req.user).then((projectAdded) => {
        response.data.project = projectAdded;
        response.status.statusCode = '200';
        response.status.message = 'Project approved successfully!!';
        res.status(200).json(response);
    }).catch((err) => {
        response.status.statusCode = '500';
        response.status.message = 'Could not approve project: ' + err.message;
        err.message
        res.status(500).json(response);
    }); 
}

function deleteProjectById(req, res) {
    var response = new Response();

    var projectId = req.params.projectId;

    adminService.deleteProjectById(projectId).then((deleteResponse) => {
        response.status.statusCode = '200';
        response.status.message = 'Project deleted successfully!!';
        res.status(200).json(response);
    }).catch((err) => {
        response.status.statusCode = '500';
        response.status.message = 'Could not delete project: ' + err.message;
        res.status(500).json(response);
    });
}

function getCaseletsForAdmin(req, res) {
    var response = new Response();

    var pageNo = req.query.pageNo;
    var limit = req.query.limit;
    var adminMid = req.query.adminMid;
    var status = req.query.status;
    var fromDate = req.query.fromDate;

    adminService.getCaseletsForAdmin(limit, pageNo, adminMid, status, fromDate).then((projects) => {
        response.data.projects = projects;
        response.status.statusCode = '200';
        response.status.message = 'Project retrieved!!';
        res.status(200).json(response);
    }).catch((err) => {
        response.status.statusCode = '500';
        response.status.message = 'Failed to get project: ' + err.message;
        res.status(500).json(response);
    });
}

function getSumbittedCaseletById(req, res) {
    var response = new Response();

    var projectId = req.params.projectId;

    adminService.getSumbittedCaseletById(projectId)
        .then((project) => {
            response.data.project = project;
            response.status.statusCode = '200';
            response.status.message = 'Submitted Project retrieved by ID successfully!!';
            res.status(200).json(response);
        }).catch((err) => {
            response.status.statusCode = '500';
            response.status.message = 'Could not get submitted project: ' + err.message;
            res.status(500).json(response);
        });
}


function sendFeedback(req, res) {
    var response = new Response();

    var pendingCaseletId = req.params.projectId;

    adminService.sendFeedback(pendingCaseletId, req.body, req.user)
        .then((project) => {
            response.data.project = project;
            response.status.statusCode = '200';
            response.status.message = 'Pending Project feedback sent by ID successfully!!';
            res.status(200).json(response);
        }).catch((err) => {
            response.status.statusCode = '500';
            response.status.message = 'Could not get send feeback for pending project: ' + err.message;
            res.status(500).json(response);
        });
}

function getAllAdmins(req, res) {
    var response = new Response();

    adminService.getAllAdmins()
        .then((admins) => {
            response.data.admins = admins;
            response.status.statusCode = 200;
            response.status.message = 'List of admins retrieved';
            res.status(200).json(response);
        }).catch((err) => {
            response.status.statusCode = '500';
            response.status.message = 'Could not get list of admins: '+ err.message;
            res.status(500).json(response);
        });
}

module.exports = adminController;