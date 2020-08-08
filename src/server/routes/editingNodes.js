
const { treeManager, TreeManager } = require('../services/treeManager')

function editNode(req, res) {
    const { nodeId, nodeDelta } = req.body
    console.log(req.body)
    if (!nodeId || !nodeDelta) return res.status(422).send({message: 'Missing property \'nodeId\' or \'nodeDelta\''})
    TreeManager.editNode(treeManager.tree, nodeId, nodeDelta)
    res.send({message: 'OK'})
}

function deleteNode(req, res) {
    const { nodeId } = req.body
    if (!nodeId) return res.status(422).send({message: 'Missing property \'nodeId\''})
    TreeManager.deleteNode(treeManager, nodeId)
    res.send({message: 'OK'})
} 

module.exports = {
    editNode,
    deleteNode
}