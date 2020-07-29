function getAncestors(req, res) {
    const { id, classification } = req.query
    res.send('a')
}

function getDescendants(req, res) {
    const { id, classification } = req.query
    res.send('d')
}

function getTreeRoot(req, res) {
    const { classification } = req.query
    res.send('t') 
}

module.exports = {
    getAncestors,
    getDescendants,
    getTreeRoot
}