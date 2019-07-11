var Promise = require('bluebird');

var tagDao = require('../dao/tagDao');

var tagService = {
    getTagCount
}

function getTagCount() {
    return new Promise((resolve, reject) => {
        tagDao.getTagCount().then((tags) => {
            console.log("Tag Count retrieved! {{In Service}}");
            resolve(tags);
        }).catch((err) => {
            console.log("Failed to get tag count {{In Service}}", err);
            reject(err);
        });
    });
}

module.exports = tagService;