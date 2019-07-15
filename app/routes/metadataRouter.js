const express = require('express');

const metadataController = require('../controllers/metadataController');
const azureAuthentication = require('../middleware/azureAuthentication');

const metadataRouter = express.Router();

metadataRouter.route('/')
    .get(azureAuthentication, metadataController.getMetadata);

module.exports = metadataRouter;