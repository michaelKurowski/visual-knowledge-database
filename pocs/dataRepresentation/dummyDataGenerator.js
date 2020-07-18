const fs = require('fs')

const MAX_CHILDREN_PER_NODE = 6
const CHANCE_FOR_NODE_TO_HAVE_CHILDREN = 0.4
const FIRST_NODE_CHILDREN_COUNT = 5



const nodesNetworkChildren = new Array(FIRST_NODE_CHILDREN_COUNT).fill(0).map(() => createNode(true, CHANCE_FOR_NODE_TO_HAVE_CHILDREN))
const nodesNetwork = {
    name: generateRandomString(20),
    thumbnail: 'http://bjlkeng.github.io/images/manifold_1d_other.png',
    description: generateRandomString(200),
    url: 'https://en.wikipedia.org/wiki/Manifold',
    color: calculateMidColorFromRange( [ [0, 0, 0], [255, 255, 255] ] ),
    children: nodesNetworkChildren,
    
}
fs.writeFile('./knowledgeNetwork.json', JSON.stringify(nodesNetwork, null, 2), err => {
    if (err) throw err
    console.log('Generation done')
})

function createNode(isFirstNode = false, chance, parentColorRange = [[0, 0, 0], [255, 255, 255]], childIndex = 0) {
    const spectrumWidths = [
        parentColorRange[1][0] - parentColorRange[0][0],
        parentColorRange[1][1] - parentColorRange[0][1],
        parentColorRange[1][2] - parentColorRange[0][2]
    ]
    let childColorRange = [ [], [] ]
    spectrumWidths.forEach((spectrumWidth, colorIndex) => {
        if (childIndex === 0) {
            childColorRange[0][colorIndex] = parentColorRange[0][colorIndex]
        } else {
            childColorRange[0][colorIndex] = Math.round((spectrumWidth / (childrenCount + 1)) * (childIndex - 1))
        }
        childColorRange[1] = Math.round((spectrumWidth /  (childrenCount + 1)) * childIndex)
    })
    
    const hasChildren = Math.random() <= chance
    let childrenCount = 0
    if (hasChildren) {
        childrenCount = Math.round(Math.random() * MAX_CHILDREN_PER_NODE)
    }
    if (isFirstNode) childrenCount = FIRST_NODE_CHILDREN_COUNT
    let newChance = chance - 0.1
    
    const children = new Array(childrenCount).fill(0).map( (child, childIndex) => {
        return createNode(false, newChance, childColorRange, childIndex)
    })
    
    return {
        name: generateRandomString(20),
        thumbnail: 'http://bjlkeng.github.io/images/manifold_1d_other.png',
        description: generateRandomString(200),
        url: 'https://en.wikipedia.org/wiki/Manifold',
        color: calculateMidColorFromRange(childColorRange),
        children,
        
    }
}

function calculateMidColorFromRange(colorRange) {
    return [
        colorRange[0][0] + ((colorRange[1][0] - colorRange[0][0]) / 2),
        colorRange[0][1] + ((colorRange[1][1] - colorRange[0][1]) / 2),
        colorRange[0][2] + ((colorRange[1][2] - colorRange[0][2]) / 2)
    ]
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
 