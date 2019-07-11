const azureStorage = require('azure-storage');
const getStream = require('into-stream');
var Response = require("../util/response");

const config = require('../config/blobStorageConfig');

const azureStorageConfig = {
    accountName: config.accountName,
    accountKey: config.storageKey,
    blobURL: "",
    containerName: config.storageContainer
};

var blobSvc = azureStorage.createBlobService(azureStorageConfig.accountName, azureStorageConfig.accountKey);

function getImageName(MID) {
    return MID + '_' + Date.now();
}

async function getUrl(project) {
    return blobSvc.getUrl(azureStorageConfig.containerName, project);
}

const uploadAzureImage = (req, res) => {
    const mid = req.user.mid;
    const blobName = getImageName(mid) + '_' + req.file.originalname;
    const stream = getStream(req.file.buffer);
    const streamLength = req.file.buffer.length;
    blobSvc.createBlockBlobFromStream(azureStorageConfig.containerName, `${blobName}`, stream, streamLength, function (error, result, uploaded) {
        var response = new Response();
        if (!error) {
            console.log(blobName);
            getUrl(blobName).then((url) => {
                console.log(url);
                var image = {
                    name: blobName,
                    url: url
                };
                req.image = image;
                
                response.data.imageName = blobName;
                response.data.imageUrl = url;

                response.status.statusCode = '200';
                response.status.message = 'Image saved!!';
                res.status(200).json(response);
            });
        } else {
            response.status.statusCode = '409';
            response.status.message = 'Failed to save image: ' + error.message;
            res.status(409).json(response);
        }
    });
}

function deleteImageFromAzureCloud(req, res) {

    var response = new Response();
    var imageUrl = req.body.imageUrl;
    console.log("Image URL: ",imageUrl);
    var blobName = imageUrl.slice(69);
    console.log("BlobName: ", blobName);
    blobSvc.deleteBlobIfExists(azureStorageConfig.containerName, blobName, err => {
        if (!err) {
            response.status.statusCode = '200';
            response.status.message = `Block blob '${blobName}' deleted`;
            res.status(200).json(response);
        }
        else {
            response.status.statusCode = '409';
            response.status.message = 'Could not delete image entry: ' + err.message;
            res.status(409).json(response);
        }
    });
}

module.exports = { uploadAzureImage, deleteImageFromAzureCloud };
