function createNodeLink({ nodeId, classificationCode }) {
    if (!nodeId || !classificationCode) {
        console.error({ nodeId, classificationCode })
        throw new Error('Tried to create NodeLink without all required parameters')
    }
    return { nodeId, classificationCode }
}

function createSourceObject({url, thumbnail = null, description = null, type = null}) {
    if (!url) {
        console.error({
            url,
            thumbnail,
            description,
            type,
        })
        throw new Error('Tried to create SourceObject without url')
    }
    return {
        url,
        thumbnail,
        description,
        type,
    }
}

function editNode(oldNode, newNode) {
    return {
        ...oldNode,
        ...newNode,
        ...{ id: oldNode.id }
    }
}

function createNode({id, name, description = null, thumbnail = null, sources = [], children = []}) {
    if (!id || !name) {
        console.error({
            id,
            name,
            description,
            thumbnail,
            sources,
            children
        })
        throw new Error('Tried to create Node object without all required parameters')
    }
    return {
        id,
        name,
        description,
        thumbnail,
        sources,
        children
    }
}

module.exports = {
    editNode
}