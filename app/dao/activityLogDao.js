var Promise = require('bluebird');

const { ActivityLog } = require('../config/sequelize');

var activityLogDao = {
    addEvent
}

function addEvent(event, mid, caseletId) {
    return new Promise((resolve, reject) => {
        ActivityLog.create({
            event: event,
            userMid: mid,
            caseletId: caseletId
        })
            .then((event, err) => {
                if (!err) {
                    console.log("Event added to Activity Log");
                    resolve(event);
                } else {
                    console.log("Failed to add event to Activity Log {{In DAO}} ", err);
                    reject(new Error("Failed to add event to Activity Log {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to add event to Activity Log {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to add event to Activity Log {{In DAO}}"));
            });
    });
}

module.exports = activityLogDao;