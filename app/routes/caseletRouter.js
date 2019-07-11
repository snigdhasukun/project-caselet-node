const express = require('express');

const caseletController = require('../controllers/caseletController');
const azureAuthentication = require('../middleware/azureAuthentication');

const caseletRouter = express.Router();

caseletRouter.route('/')
    .get(azureAuthentication, caseletController.getProjects)
    .post(azureAuthentication, caseletController.addPendingCaselet);

caseletRouter.route('/save')
    .get(azureAuthentication, caseletController.getSavedCaseletsByUser);

caseletRouter.route('/search')
    .get(azureAuthentication, caseletController.searchAndFilterCaselet);

caseletRouter.route('/like')
    .get(azureAuthentication, caseletController.getMostLikedProjects);

caseletRouter.route('/share')
    .get(azureAuthentication, caseletController.getMostSharedProjects);

caseletRouter.route('/download')
    .get(azureAuthentication, caseletController.getMostDownloadededProjects);

caseletRouter.route('/view')
    .get(azureAuthentication, caseletController.getMostViewedProjects);

caseletRouter.route('/like/:projectId')
    .put(azureAuthentication, caseletController.likeProject);

caseletRouter.route('/share/:projectId')
    .put(azureAuthentication, caseletController.shareProject);

caseletRouter.route('/download/:projectId')
    .put(azureAuthentication, caseletController.downloadProject);

caseletRouter.route('/:projectId')
    .get(azureAuthentication, caseletController.getProjectById);

module.exports = caseletRouter;