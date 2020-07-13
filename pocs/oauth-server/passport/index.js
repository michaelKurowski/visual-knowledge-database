const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GoogleUser = require('../db/schema/googleUser')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/redirect'
}, (accessToken, refreshToken, profile, done) => {
    //check if user already exists in our db with the given profile id
    const loginRegister = require('../account/loginRegister')
    loginRegister(profile, done)
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