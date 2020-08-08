/*
    This is a manager for using dummy, temporary data. It should be replaced with a manager
    that will call the actuall database later on.
*/


const tree = require('../dummyData/knowledgeNetwork.json')

class DummyTreeManager {
    constructor() {
        this.tree = DummyTreeManager.flattenKnowledgeTree(tree)
        this.root = tree
        this.convertReferencesToId()
    }

    static getNode(tree, id) {
        return tree.find(node => node.name === id)
    }

    static getAncestors(tree, node, levelsOfAncestors) {
        if (levelsOfAncestors === 0) return [node]
        if (!node) return []
        return [
            node,
            ...DummyTreeManager.getAncestors(
                tree,
                tree.find(child => child.children.indexOf(node.name) !== -1),
                levelsOfAncestors - 1
            )
        ]
    }

    static getDescendants(tree, node, levelsOfDescendants) {
        if (levelsOfDescendants === 0) return [node]
        if (!node) return []
        if (!node.children) return []
        return [
            node,
            ...node.children.flatMap(child => {
                const childObject = DummyTreeManager.getNode(tree, child)
                return [
                    ...DummyTreeManager.getDescendants(
                        tree,
                        childObject,
                        levelsOfDescendants - 1
                    )
                ]
            }
                
            )
        ]
    }

    static flattenKnowledgeTree(node) {
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


module.exports = {
    treeManager: new DummyTreeManager(),
    TreeManager: DummyTreeManager
}