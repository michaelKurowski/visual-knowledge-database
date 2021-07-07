const express = require('express')
const router = express.Router({mergeParams: true})
const passport = require('../passport')

router.get('/', (req, res) => {
    res.render('home', {user: req.user})
})

router.get('/logout', (req, res) => {
    req.logout()
    res.send(req.user)
})

//Facebook Routing
router.get('/auth/facebook', passport.authenticate('facebook'), (req, res) => {
    //TODO: Later
})

router.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/account')
})

//Github Routing
router.get('/auth/github', passport.authenticate('github'), (req, res) => {
    //TODO: Later
})

router.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/account')
})

//Twitter Routing
router.get('/auth/twitter', passport.authenticate('twitter'),(req, res) => {
    //TODO: Later
})
  
router.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/account')
})

//Google Routing
router.get('/auth/google', passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/plus.login'
    ]
}))

router.get("/auth/google/redirect", passport.authenticate("google", {failureRedirect: '/'}), (req,res)=>{
    res.redirect('/')
})

module.exports = router