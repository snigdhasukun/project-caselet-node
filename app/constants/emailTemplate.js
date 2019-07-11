var emailConfig = require('../config/emailConfig');

module.exports = function template(action, from, to, data) {
    if (action == 'share') {
        return template = {
            from: emailConfig.mail_accounts.projectcaselets.email,
            to: to.email,
            subject: from.name + ' has shared a Project caselet with you',
            text: 'Dear ' + to.name + ',\n\n' + from.name + ' has shared the following project caselet with you.\n\n' + data.title + ' - ' + data.link + ' \n\n with the message "' + data.message + '". \n\nWe hope you get inspiration from the caselet. \n\nWarm regards, \nProject Caselets'
        }
    }
    else if (action == 'approved') {
        return template = {
            from: emailConfig.mail_accounts.projectcaselets.email,
            to: to.email,
            subject: from.name + ' has approved your Project Caselet',
            text: 'Dear ' + to.name + ',\n\n' + from.name + ' has approved the project caselet submitted by you.\n\n' + data.title + ' - ' + data.link + '\n\nWe hope you share the caselet with others. \n\nWarm regards, \nProject Caselets'
        }
    }
    else if (action == 'reject') {
        return template = {
            from: emailConfig.mail_accounts.projectcaselets.email,
            to: to.email,
            subject: from.name + ' has sent back your Project Caselet',
            text: 'Dear ' + to.name + ',\n\n' + from.name + ' has sent back the project caselet submitted by you with the following feedback:\n\n' + data.message + '\n\nPlease modify and your caselet according to the ffedback given by admin.\n\n' +data.link +'\n\nWarm regards, \nProject Caselets'
        }
    }
}
