const express = require('express')
const router = express.Router({mergeParams: true})
const passport = require('../passport')

router.get("auth/google/redirect", passport.authenticate("google"), (req,res)=>{
    res.send(req.user)
    res.send("you reached the redirect URI")
})

module.exports = router