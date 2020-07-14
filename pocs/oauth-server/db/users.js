module.exports = (UserModel = require('./schema/googleUser')) => {
    return {
        getUserById(id) {
            return UserModel.findById(id).exec()
        },
        getUserByEmail(email) {
            return UserModel.findOne({email}).exec()
        }
    }
}