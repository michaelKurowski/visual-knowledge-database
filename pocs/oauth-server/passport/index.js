const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const GithubStrategy = require('passport-github2').Strategy
const User = require('../db/schema/user')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/redirect'
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({id: profile.id}).then((currentUser) => {
        if(currentUser){
            done(null, currentUser)
        } else {
            new User({id: profile.id})
            .save()
            .then((newUser) => {
                done(null, newUser)
            })
        }
    })
}))

passport.use(new FacebookStrategy({
    clientID: '',
    clientSecret: '',
    callbackURL: ''
}, (accessToken, refreshToken, profile, done) => {
    //Create new user or login
}))

passport.use(new TwitterStrategy({
    consumerKey: '',
    consumerSecret: '',
    callbackURL: ''
}, (accessToken, refreshToken, profile, done) => {
    //Create new user or login
}))

passport.use(new GithubStrategy({
    clientID: '',
    clientSecret: '',
    callbackURL: ''
}, (accessToken, refreshToken, profile, done) => {
    //Create new user or register
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user)
    })
})

module.exports = passport