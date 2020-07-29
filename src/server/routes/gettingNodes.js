function getAncestors(req, res) {
    const { nodeId, classificationId } = req.query
    res.send('a')
}

function getDescendants(req, res) {
    const { nodeId, classificationId } = req.query
    res.send('d')
}

function getTreeRoot(req, res) {
    const { classificationId } = req.query
    res.send('t') 
}

module.exports = {
    getAncestors,
    getDescendants,
    getTreeRoot
}