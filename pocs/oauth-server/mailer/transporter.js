const nodemailer = require('nodemailer')
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS

module.exports = nodemailer.createTransport({
    service: 'mail',
    host: 'smtp.mail.com',
    port: 587,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
})