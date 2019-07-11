const express = require('express');
const multer = require('multer');

const azureAuthentication = require('../middleware/azureAuthentication');
const { uploadAzureImage, deleteImageFromAzureCloud } = require('../middleware/imageUploadAzure');

const imageRouter = express.Router();
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });

imageRouter.route('/')
    .post(azureAuthentication, singleFileUpload.single('image'), uploadAzureImage)
    .delete(azureAuthentication, deleteImageFromAzureCloud);

module.exports = imageRouter;
