module.exports = {

    // // Email details Ronak test
    // service: "Gmail",
    // email: "projectwork3197@gmail.com",
    // pass: "ronak3197"

    // Email Details
    mail_host: process.env.MAIL_HOST || `smtp.mindtree.com`,
    mail_port: process.env.MAIL_PORT || 25,
    mail_secure_connection: process.env.MAIL_SECURE_CONNECTION || false,
    mail_debug: process.env.MAIL_DEBUG || true,
    mail_logger: process.env.MAIL_LOGGER || true,
    mail_tls: {
        ciphers: process.env.MAIL_CIPHERS || `SSLv3`,
    },
    mail_accounts: {
        projectcaselets: {
            login_detail: {
                user:
                    process.env.PROJECTCASELET_USER ||
                    "supportcaselet@mindtree.com",
                pass: process.env.PROJECTCASELET_PASS || `Case12345@`,
            },
            email:
                process.env.PROJECTCASELET_EMAIL ||
                "Support.Caselet@mindtree.com",
        },
    }
}
