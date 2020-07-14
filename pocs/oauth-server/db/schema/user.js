const Schema = require('mongoose').Schema
const uniqueValidator = require('mongoose-unique-validator')
const dbConnection = require('../dbConnectionProvider').getDbConnection()

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(uniqueValidator, {message: 'DUPLICATE KEY ERROR'})
const UserModel = dbConnection.model('users', userSchema)

module.exports = UserModel