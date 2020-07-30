const express = require('express')
const router = require('./router')

const DTM = require('./services/treeManager')


const PORT = 8000



const app = express()
app.use(router)
app.listen(PORT, () => {
    console.log('Server is listening on', PORT)
})

var dtm = new DTM()
console.log(DTM.getNode(dtm.tree, 'tjgWwZIS2eYnN2brljyf'))
console.log(DTM.getAncestors(dtm.tree, DTM.getNode(dtm.tree, 'tjgWwZIS2eYnN2brljyf'), 2))