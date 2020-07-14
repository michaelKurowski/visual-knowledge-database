const Schema = require('mongoose').Schema
const uniqueValidator = require('mongoose-unique-validator')
const dbConnection = require('../dbConnectionProvider').getDbConnection()

const verifySchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdOn: {
        type: String
    },
    token: {
        type: String,
        required: true,
        unique: true
    }
})

verifySchema.plugin(uniqueValidator, {message: 'DUPLICATE EMAIL TOKEN ERROR'})
const VerifyModel = dbConnection.model('emailTokens', verifySchema)

module.exports = VerifyModel