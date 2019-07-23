var nodemailer = require('nodemailer');

var config = require('../config/emailConfig');
var template = require('../templates/emailTemplate');

// var transporter = nodemailer.createTransport({
//   service: config.service,
//   auth: {
//     user: config.email,
//     pass: config.pass
//   }
// });

let options = {
  host: config.mail_host,
  port: config.mail_port,
  secureConnection: config.mail_secure_connection,
  tls: config.mail_tls,
  debug: config.mail_debug,
  logger: config.mail_logger,
}

options.auth = config.mail_accounts[`projectcaselets`].login_detail

var transporter = nodemailer.createTransport(options);

function sendEmail(action, from, to, data) {
  var mailOptions = template(action, from, to, data);
  return transporter.sendMail(mailOptions);
}

module.exports = sendEmail;