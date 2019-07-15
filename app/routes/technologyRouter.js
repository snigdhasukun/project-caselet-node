const express = require('express');

const technologyController = require('../controllers/technologyController');
const azureAuthentication = require('../middleware/azureAuthentication');

const technologyRouter = express.Router();

technologyRouter.route('/')
    .get(azureAuthentication, technologyController.getTechnologies);

module.exports = technologyRouter;