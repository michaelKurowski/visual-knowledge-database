const Schema = require('mongoose').Schema
const uniqueValidator = require('mongoose-unique-validator')
const dbConnection = require('../dbConnectionProvider').getDbConnection()

const googleUserSchema = new Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    consent: {
        type: Boolean,
        required: true
    }
}, {timestamps: true})

googleUserSchema.plugin(uniqueValidator, {message: 'DUPLICATE KEY ERROR'})
const GoogleUserModel = dbConnection.model('googleUser', googleUserSchema)

module.exports = GoogleUserModel