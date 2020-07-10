const fs = require('fs')

const MAX_CHILDREN_PER_NODE = 6
const CHANCE_FOR_NODE_TO_HAVE_CHILDREN = 0.4
const FIRST_NODE_CHILDREN_COUNT = 5


const nodesNetwork = createNode(true)

fs.writeFile('./knowledgeNetwork.json', JSON.stringify(nodesNetwork, null, 2), err => {
    if (err) throw err
    console.log('Generation done')
})

function createNode(isFirstNode = false) {
    const hasChildren = Math.random() <= CHANCE_FOR_NODE_TO_HAVE_CHILDREN
    let childrenCount = 0
    if (hasChildren) {
        childrenCount = Math.round(Math.random() * MAX_CHILDREN_PER_NODE)
    }
    if (isFirstNode) childrenCount = FIRST_NODE_CHILDREN_COUNT
    const children = new Array(childrenCount).fill(0).map(createNode)

    return {
        name: generateRandomString(20),
        thumbnail: 'http://bjlkeng.github.io/images/manifold_1d_other.png',
        description: generateRandomString(200),
        url: 'https://en.wikipedia.org/wiki/Manifold',
        children
    }
}



function generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 