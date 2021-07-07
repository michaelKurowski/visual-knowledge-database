const express = require('express')
require('dotenv').config()
const app = express()
const db = require('./db') //Init db link
const PORT = process.env.PORT || 3000
const passport = require('./passport')
const cookieSession = require("cookie-session")


app.use(require('body-parser').urlencoded({ extended: true }));
app.use(cookieSession({maxAge: 24*60*60*1000, keys: [process.env.SECRET_COOKIE]}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'))

//Use OAuth routes
app.use('/', require('./routes/oauth'))
app.use('/account', require('./routes/account'))

app.listen(PORT, () => console.log('Server is listening on:', PORT))