const express = require('express');

const filterController = require('../controllers/filterController');
const azureAuthentication = require('../middleware/azureAuthentication');

const filterRouter = express.Router();

filterRouter.route('/')
    .get(azureAuthentication, filterController.getFilters);

filterRouter.route('/technologies')
    .get(azureAuthentication, filterController.getTechnologies);

filterRouter.route('/tools')
    .get(azureAuthentication, filterController.getTools);

module.exports = filterRouter;