const express = require('express')
const router = express.Router({mergeParams: true})

router.get('auth/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send(req.user)
    res.send('You reached the redirect URI')
})