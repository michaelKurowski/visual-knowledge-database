const express = require('express')
const router = express.Router({mergeParams: true})
const passport = require('../passport')

router.get('/', (req, res) => {
    res.render('home', {user: req.user})
})

app.get('/logout', (req, res) => {
    req.logout()
    res.send(req.user)
})

router.get('/auth/google', passport.authenticate('google', {scope: ['profile, email']}))

router.get("auth/google/redirect", passport.authenticate("google"), (req,res)=>{
    res.send(req.user)
    res.send("you reached the redirect URI")
})

module.exports = router