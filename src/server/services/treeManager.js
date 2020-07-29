/*
    This is a manager for using dummy, temporary data. It should be replaced with a manager
    that will call the actuall database later on.
*/


const tree = require('../dummyData/knowledgeNetwork.json')

class DummyTreeManager {
    constructor() {
        this.tree = DummyTreeManager.flattenKnowledgeTree(tree)
        this.convertReferencesToId()
    }

    static getNode(tree, id) {
        return tree.find(node => node.name === id)
    }

    static getAncestors(tree, node, levelsOfAncestors) {
        if (levelsOfAncestors === 0) return [node]
        return [
            node,
            ...node.children.flatMap(child => {
                const childObject = DummyTreeManager.getNode(tree, child)
                return [
                    ...DummyTreeManager.getAncestors(
                        tree,
                        childObject,
                        levelsOfAncestors - 1
                    )
                ]
            }
                
            )
        ]
    }

    static flattenKnowledgeTree(node) {
        const newNode = node
        return [
            node,
            ...node.children.flatMap(child => DummyTreeManager.flattenKnowledgeTree(child))
        ]
    }

    convertReferencesToId() {
        this.tree = this.tree.map(node => {
            node.children = node.children.map(child => child.name)
            return node
        })
    }
}


module.exports = DummyTreeManager