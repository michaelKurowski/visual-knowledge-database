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

router.get('/auth/google', passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}))

router.get("/auth/google/redirect", passport.authenticate("google", {failureRedirect: '/'}), (req,res)=>{
    res.redirect('/')
})

module.exports = router