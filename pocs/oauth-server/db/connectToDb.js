const mongoose = require('mongoose')
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

const URL = `mongodb://${dbUser}:${dbPassword}@ds014808.mlab.com:14808/vsb`

module.exports = () => {
    const db = mongoose.createConnection(URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    db.on('error', err => {
        const errorText = `Failed to connect to database with url ${URL}, Error: ${err}`
        console.error(errorText)
        throw new Error(errorText)
    })
    db.once('open', () => console.log('Connected to the database.'))
    return db
}