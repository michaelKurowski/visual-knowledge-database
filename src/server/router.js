const { Router } = require('express')
const router = Router()

const gettingNodes = require('./routes/gettingNodes')
const editingNodes = require('./routes/editingNodes')

router.get('/ancestors', gettingNodes.getAncestors)
router.get('/descendants', gettingNodes.getDescendants)
router.get('/tree-root', gettingNodes.getTreeRoot)

router.post('/edit-node', editingNodes.editNode)
router.post('/delete-node', editingNodes.deleteNode)

module.exports = router