const express = require('express');

const toolController = require('../controllers/toolController');
const azureAuthentication = require('../middleware/azureAuthentication');

const toolRouter = express.Router();

toolRouter.route('/')
    .get(azureAuthentication, toolController.getTools);

module.exports = toolRouter;