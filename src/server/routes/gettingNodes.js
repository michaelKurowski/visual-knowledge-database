const TreeManager = require('../services/treeManager')
const logger = require('../logger').logRoute


const SEARCH_DEPTH = 2
const treeManager = new TreeManager()


function getAncestors(req, res) {
    const { nodeId, classificationId } = req.query
    logger('ancestors', req.query)
    if (!nodeId) return res.status(422).send({message: 'Missing property \'nodeId\''})
    const startingNode = TreeManager.getNode(treeManager.tree, nodeId)
    const ancestors = TreeManager.getAncestors(treeManager.tree, startingNode, SEARCH_DEPTH)
    const ancestorChildren = ancestors.flatMap(ancestor => 
        TreeManager.getDescendants(treeManager.tree, ancestor, SEARCH_DEPTH))
    const ancestorChildrenWithoutDuplicates = [...new Set(ancestorChildren)]
    res.send({
        message: 'OK',
        nodes: ancestorChildrenWithoutDuplicates
    })
}

function getDescendants(req, res) {
    const { nodeId, classificationId } = req.query
    if (!nodeId) return res.status(422).send({message: 'Missing property \'nodeId\''})
    const startingNode = TreeManager.getNode(treeManager.tree, nodeId)
    const descendats = TreeManager.getDescendants(treeManager.tree, startingNode, SEARCH_DEPTH)
    res.send({
        message: 'OK',
        nodes: descendats
    })
}

function getTreeRoot(req, res) {
    const { classificationId } = req.query
    res.send({
        message: 'OK',
        nodes: TreeManager.getDescendants(treeManager.tree, treeManager.root, SEARCH_DEPTH)
    }) 
}

module.exports = {
    getAncestors,
    getDescendants,
    getTreeRoot
}