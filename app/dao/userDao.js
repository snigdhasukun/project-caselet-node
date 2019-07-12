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
                    console.log("User retrieved{{In DAO}}");
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
            where: {
                role: 'admin'
            }
        }).then((admins, error) => {
            if (!error) {
                resolve(admins);
            } else {
                console.log("Failed to get admins", error);
                reject(new Error("Failed to get admins"));
            }
        }).catch((error) => {
            console.log("Failed to get admins", error);
            reject(new Error("Failed to get admins"));
        });
    })
}

module.exports = userDao;
