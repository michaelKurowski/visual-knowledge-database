const { Router } = require('express')
const router = Router()

const gettingNodes = require('./routes/gettingNodes')

router.get('/ancestors', gettingNodes.getAncestors)
router.get('/descendants', gettingNodes.getDescendants)
router.get('/tree-root', gettingNodes.getTreeRoot)


module.exports = router