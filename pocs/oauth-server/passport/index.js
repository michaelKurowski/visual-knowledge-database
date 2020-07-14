const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GoogleUser = require('../db/schema/googleUser')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/redirect'
}, (accessToken, refreshToken, profile, done) => {
    GoogleUser.findOne({googleId: profile.id}).then((currentUser) => {
        if(currentUser){
            done(null, currentUser)
        } else {
            new GoogleUser({googleId: profile.id, token: accessToken, email: profile._json.email })
            .save()
            .then((newUser) => {
                done(null, newUser)
            })
        }
    })
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    GoogleUser.findById(id).then(user => {
        done(null, user)
    })
})

module.exports = passport