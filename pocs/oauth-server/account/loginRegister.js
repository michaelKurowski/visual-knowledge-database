module.exports = (profile, done, GoogleUser = require('../db/schema/googleUser')) => {
    GoogleUser.findOne({googleId: profile.id}).then((currentUser) => {
        if(currentUser){
            done(null, currentUser)
        } else {
            new GoogleUser({googleId: profile.id })
            .save()
            .then((newUser) => {
                done(null, newUser)
            })
        }
    })
}