const express = require('express')
const router = express.Router({mergeParams: true})
const passport = require('../passport')
const {isUserAuthenticated} = require('../middleware')

router.post('/info', isUserAuthenticated, (req, res) => {
    res.send(400)
})

router.post('/remove', isUserAuthenticated, (req, res) => {
    res.send(400)
})