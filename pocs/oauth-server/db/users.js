module.exports = (UserModel = require('./schema/user')) => {
    return {
        getUserById(id) {
            return UserModel.findById(id).exec()
        },
        getUserByEmail(email) {
            return UserModel.findOne({email}).exec()
        }
    }
}