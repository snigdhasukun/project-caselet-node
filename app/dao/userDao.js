var Promise = require('bluebird');

const { User } = require('../config/sequelize');

var userDao = {
    addUser,
    getUserByMid,
    getAllAdmins
}

function addUser(userMid) {
    return new Promise((resolve, reject) => {
        User.findOrCreate({ where: { mid: userMid } })
            .spread((user, created) => {
                resolve(user);
            }).catch((error) => {
                console.log("Failed to add user {{In DAO}}")
                console.log('Error', error);
                reject(new Error("Failed to add user {{In DAO}}"));
            });
    });
}

function getUserByMid(userMid) {
    return new Promise((resolve, reject) => {
        User.findByPk(userMid)
            .then((user, err) => {
                if (!err) {
                    console.log("User retrieved by MID {{In DAO}}");
                    resolve(user);
                } else {
                    console.log("Failed to get user by MID {{In DAO}} ", err);
                    reject(new Error("Failed to get user by MID {{In DAO}}"));
                }
            }).catch((error) => {
                console.log("Failed to get user by MID {{In DAO}}");
                console.log('Error', error);
                reject(new Error("Failed to get user by MID {{In DAO}}"));
            });
    });
}

function getAllAdmins() {
    return new Promise((resolve, reject) => {
        User.findAll({
            attributes: ['mid'],
            where: { role: 'admin' }
        }).then((admins, err) => {
            if (!err) {
                console.log("List of Admins retrieved {{In DAO}}");
                resolve(admins);
            } else {
                console.log("Failed to get list of admins {{In DAO}} ", err);
                reject(new Error("Failed to get list of admins {{In DAO}}"));
            }
        }).catch((error) => {
            console.log("Failed to get list of admins {{In DAO}} ", error);
            reject(new Error("Failed to get list of admins {{In DAO}}"));
        });
    })
}

module.exports = userDao;
