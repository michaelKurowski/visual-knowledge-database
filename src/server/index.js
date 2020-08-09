const express = require('express')
const router = require('./router')
const bodyParser = require('body-parser')
const cors = require('cors')

const PORT = 8000

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(router)
app.listen(PORT, () => {
    console.log('Server is listening on', PORT)
})