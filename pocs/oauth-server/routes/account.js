const express = require('express')
const router = express.Router({mergeParams: true})
const passport = require('../passport')


const GOOGLE_REGISTRATION_URL = '/'
const GOOGLE_METHOD = 'google'

router.post('/register', (req, res) => {
    const {method, consent} = req.body
    if(!consent) return res.send(400, 'Privacy Policy must be accepted.')

    switch(method) {
        case GOOGLE_METHOD:
            return res.redirect(GOOGLE_REGISTRATION_URL)
        default:
            return res.send(400, 'Invalid Method')
    }
})

module.exports = router