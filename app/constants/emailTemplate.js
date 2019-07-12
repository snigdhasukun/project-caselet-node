var emailConfig = require('../config/emailConfig');

const link = 'https://yorbit.mindtree.com/projectcaselets/';

module.exports = function template(action, from, to, data) {
    if (action == 'share') {
        return template = {
            from: emailConfig.mail_accounts.projectcaselets.email,
            to: to.email,
            subject: from + ' has shared a Project caselet with you',
            text: 'Dear ' + to.name + ',\n\n' + from + ' has shared the following caselet with you.\n\n' + data.title + ' - ' + link + 'caselet/' + data.projectId + ' \n\n with the message "' + data.message + '". \n\nWe hope you get inspiration from the caselet. \n\nWarm regards, \nProject Caselets',
            html: '<p>Dear ' + to.name + ',<br><br> <b><em>' + from + '</em></b> has shared the following caselet with you.<br><br> <b style="color:#1a6366">' + data.title + '</b> - ' + link + 'caselet/' + data.projectId + '<br><br> with the message <b style="color:#5a1e7d">"' + data.message + '"</b>. <br><br>We hope you get inspiration from the caselet! <br><br>Warm regards, <br>Project Caselets</p>'
        }
    }
    else if (action == 'approved') {
        return template = {
            from: emailConfig.mail_accounts.projectcaselets.email,
            to: to.email,
            subject: from + ' has approved your Project Caselet',
            text: 'Dear ' + to.name + ',\n\n' + from + ' has approved the caselet submitted by you.\n\n' + data.title + ' - ' + link + 'caselet/' + data.projectId + '\n\nWe hope you share the caselet with others to inspire them! \n\nWarm regards, \nProject Caselets',
            html: '<p>Dear ' + to.name + ',<br><br> <b><em>' + from + '</em></b> has approved the caselet submitted by you.<br><br> <b style="color:#1a6366">' + data.title + '</b> - ' + link + 'caselet/' + data.projectId + '<br><br>We hope you share your caselet with others to inspire them! <br><br>Warm regards, <br>Project Caselets</p>'
        }
    }
    else if (action == 'reject') {
        return template = {
            from: emailConfig.mail_accounts.projectcaselets.email,
            to: to.email,
            subject: from + ' has sent back your Project Caselet',
            text: 'Dear ' + to.name + ',\n\n' + from + ' has sent back the caselet submitted by you with the following feedback:\n\n' + data + '\n\nPlease modify your caselet according to the feedback given by admin.\n\n' + link + 'user/addCaselet' + '\n\nWarm regards, \nProject Caselets',
            html: '<p>Dear ' + to.name + ',<br><br> <b><em>' + from + '</em></b> has sent back the caselet submitted by you with the following feedback:<br><br> <b style="color:#850827">"' + data + '"</b> <br><br>Please modify your caselet according to the feedback given by admin.<br><br>' + link + 'user/addCaselet' + '<br><br>Warm regards, <br>Project Caselets</p>'
        }
    }
}
