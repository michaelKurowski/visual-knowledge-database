module.exports = (token, profile, done, GoogleUser = require('../db/schema/googleUser')) => {
    GoogleUser.findOne({googleId: profile.id}).then((currentUser) => {
        if(currentUser){
            done(null, currentUser)
        } else {
            new GoogleUser({googleId: profile.id, token, email: profile.email })
            .save()
            .then((newUser) => {
                done(null, newUser)
            })
        }
    })
}