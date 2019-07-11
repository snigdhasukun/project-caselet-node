var Promise = require('bluebird');

var userDao = require('../dao/userDao');


var userService = {
    addUser,
    getUserByMid
}

function addUser(userMid) {
    return new Promise((resolve, reject) => {
        userDao.addUser(userMid).then((user) => {
            console.log("User added! {{In Service}}");
            resolve(user);
        }).catch((err) => {
            console.log("Failed to add user {{In Service}}", err);
            reject(err);
        });
    });
}

function getUserByMid(userMid) {
    return new Promise((resolve, reject) => {
        userDao.getUserByMid(userMid).then((user) => {
            console.log("User retrieved by MID! {{In Service}}");
            resolve(user);
        }).catch((err) => {
            console.log("Failed to get user by MID {{In Service}}", err);
            reject(err);
        });
    });
}

module.exports = userService;
