const crypto = require('crypto')
const mailer = require('../mailer')

function prepareToken(email, VerifyModel = require('../db/schema/verify')) {
    const token = crypto.randomBytes(64).toString('hex')

    const data = {
        email,
        createdOn: new Date().getTime(),
        token
    }

    const instance = new VerifyModel(data)

    instance.save()
    .then(() => mailer.sendVerificationMail(email, token))
    .catch((err) => console.error(err))
}

module.exports = prepareToken