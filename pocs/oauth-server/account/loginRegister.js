module.exports = (profile, done, User = require('../db/schema/user')) => {
    User.findOne({googleId: profile.id}).then((currentUser) => {
        if(currentUser){
            done(null, currentUser)
        } else {
            new User({googleId: profile.id })
            .save()
            .then((newUser) => {
                done(null, newUser)
            })
        }
    })
}