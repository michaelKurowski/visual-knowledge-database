
const LEVELS_DISTANCE = 300
const FIRST_LEVEL_NODES = 5
const FIRST_LEVEL_NODE_SIZE = 30
const LINE_WIDTH = 3
const LINE_OPACITY = 0.5
const LINE_COLOR = '#afafaf'



const MAX_CHILDREN = 5
const CIRCLE_BORDER_WIDTH = 0
const CIRCLE_BORDER_COLOR = '#afafaf'
const CIRCLE_FILL_COLOR = '#dd2727'
const CHILDREN_SPREAD_FACTOR = 1.2
const MAX_LEVEL_DEPTH = 2
const TEXT_COLOR = '#dd2727'

const MOVE_DURATION = 0.5



const width = window.innerWidth;
const height = window.innerHeight;

const centerX = width / 2
const centerY = height / 2

const stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
});
const layer = new Konva.Layer();



let clickedNode = null
let currentCoordinates = {x: centerX, y: centerY}
let moveAnimation = null
let moveAnimationDirection = null
let animationTarget = null
let animationDistance = null
let knowledgeNetwork = null
let edgeBeziers = []

fetch('./knowledgeNetwork.json')
    .then(response => response.json())
    .then(pulledKnowledgeNetwork => {
        stage.add(layer);
        knowledgeNetwork = pulledKnowledgeNetwork
        assignParents(pulledKnowledgeNetwork)
        drawTree(pulledKnowledgeNetwork)
    })


function hideAncestorNodes(rootNode, preserveNode, cb) {
    if (rootNode.name === preserveNode.name) {
        rootNode.konva.bezier.to({
            opacity: 0,
            duration: MOVE_DURATION,
            onFinish: cb
        })
    }
    hideDedscendantNodes(rootNode, preserveNode)
    if (!rootNode.parent) return
    hideAncestorNodes(rootNode.parent, preserveNode)
}

function hideDedscendantNodes(rootNode, preserveNode) {
    if (preserveNode.name === rootNode.name) return
    if (!rootNode.konva) return
    rootNode.konva.circle.to({
        opacity: 0,
        duration: MOVE_DURATION,
        onFinish() {
            rootNode.konva.circle.destroy()
        }
    })
    rootNode.konva.caption.to({
        opacity: 0,
        duration: MOVE_DURATION,
        onFinish() {
            rootNode.konva.caption.destroy()
        }
    })
    if (rootNode.konva.bezier) {
        rootNode.konva.bezier.to({
            opacity: 0,
            duration: MOVE_DURATION,
            onFinish() {
                rootNode.konva.bezier.destroy()
            }
        })
    }

    rootNode.children.forEach(child => hideDedscendantNodes(child, preserveNode))
}


function drawTree(rootNode, transitionToNewDraw = false) {
    if (!transitionToNewDraw) edgeBeziers = []
    const circlePosition = {
        x: centerX,
        y: centerY
    }

    if (transitionToNewDraw) {
        animateNodeToNewCoordinates(rootNode, circlePosition)
        drawBranches(rootNode, transitionToNewDraw)
        return
    }
    layer.destroyChildren()
    drawAndDecorateNode(rootNode, circlePosition)
    const rootCircle = rootNode.konva.circle
    const rootCaption = rootNode.konva.caption

    if (rootNode.parent)
        rootCircle.on('click tap', handleClick(rootNode.parent, {x: centerX, y: centerY}))
    drawBranches(rootNode, transitionToNewDraw)
    layer.add(rootCircle)
    layer.add(rootCaption)
    layer.draw()
}

function drawBranches(rootNode, transitionToNewDraw = false) {
    for (let i = 0 ; i < rootNode.children.length ; i++) {
        const childrenNode = rootNode.children[i]
        const childDegree = (i / rootNode.children.length) * Math.PI * 2
        
        const childPosition = pointAlongCircle({
            position: {
                x: centerX,
                y: centerY
            },
            size: LEVELS_DISTANCE,
            degree: childDegree
        })

        if (transitionToNewDraw) {
            const newBezierPoints = [
                centerX,
                centerY,
                centerX,
                centerY,
                centerX,
                centerY,
                childPosition.x,
                childPosition.y,
            ]
            animateNodeToNewCoordinates(childrenNode, childPosition, newBezierPoints)
            continue
        }
        drawAndDecorateNode(childrenNode, childPosition)
        childrenNode.konva.bezier = new Konva.Line({
            points: [centerX, centerY, childPosition.x, childPosition.y, centerX, centerY],
            strokeWidth: LINE_WIDTH,
            stroke: LINE_COLOR,
            lineCap: 'round',
            id: 'bezierLinePath',
            opacity: LINE_OPACITY,
          })
        drawLevel({
            levelDepth: 2,
            node: childrenNode,
            parentPosition: childPosition,
            parentDegree: childDegree,
            transitionToNewDraw
        })
        layer.add(childrenNode.konva.bezier);
        layer.add(childrenNode.konva.caption)
        layer.add(childrenNode.konva.circle);
    }
}

function drawLevel({
    levelDepth,
    node,
    parentPosition,
    parentDegree,
    transitionToNewDraw = false
}) {
    
    const countOfChildren = node.children.length
    const offset = !isEven(countOfChildren) ?  - (1/10) : 0
    const centralPoint = pointAlongCircle({
        position: {
            x: centerX,
            y: centerY
        },
        size: LEVELS_DISTANCE * (levelDepth - 0.5),
        degree: parentDegree
    })
    const shouldDrawFadingOutBeziers = levelDepth === MAX_LEVEL_DEPTH + 1
    for (let i = 0 ; i < countOfChildren ; i++) {
        const childNode = node.children[i]

        const spreadIterator = isEven(i) ? i : i - 1 
        const spreadStep =
            ((spreadIterator * CHILDREN_SPREAD_FACTOR) + 1) / (((levelDepth - 1) * LEVELS_DISTANCE) / 300)
        const nextStepDegree = isEven(i) ? parentDegree + spreadStep / 10 : parentDegree - spreadStep / 10
        const degree = countOfChildren === 1 ? parentDegree : nextStepDegree + offset
        const childPosition = pointAlongCircle({
            position: {
                x: centerX,
                y: centerY
            },
            size: LEVELS_DISTANCE * levelDepth,
            degree
        })
        const childCentralPoint = pointAlongCircle({
            position: {
                x: centerX,
                y: centerY
            },
            size: LEVELS_DISTANCE * (levelDepth - 0.5),
            degree: countOfChildren === 1 ? parentDegree : nextStepDegree + offset
        })
        const bezierPosition = {
            points: [
                parentPosition.x,
                parentPosition.y,
                centralPoint.x,
                centralPoint.y,
                childCentralPoint.x,
                childCentralPoint.y,
                childPosition.x,
                childPosition.y,
                
            ]
        }
        
        if (shouldDrawFadingOutBeziers) {
            const bezierLinePath = new Konva.Line({
                strokeWidth: LINE_WIDTH,
                id: 'bezierLinePath',
                opacity: LINE_OPACITY,
                lineCap: 'round',
                lineJoin: 'round',
                bezier: true,
                strokeLinearGradientStartPoint: {
                    x: parentPosition.x,
                    y: parentPosition.y
                },
                strokeLinearGradientEndPoint: {
                    x: childPosition.x,
                    y: childPosition.y
                },
                strokeLinearGradientColorStops: [
                    0,
                    LINE_COLOR,
                    1,
                    'rgba(66,71,79,0)'
                ],
                points: [
                    parentPosition.x,
                    parentPosition.y,
                    centralPoint.x,
                    centralPoint.y,
                    childCentralPoint.x,
                    childCentralPoint.y,
                    childPosition.x,
                    childPosition.y,
                ],
            });
            layer.add(bezierLinePath);
            edgeBeziers.push({
                konva: bezierLinePath,
                parent: node
            })
            
            continue
        }

        if (transitionToNewDraw) {
            animateNodeToNewCoordinates(node, childPosition, bezierPosition)
            drawLevel({
                levelDepth: levelDepth + 1,
                node: childNode,
                parentPosition: childPosition,
                parentDegree: degree,
                transitionToNewDraw
            })
            continue
        }

        drawAndDecorateNode(childNode, childPosition)
        
        childNode.konva.bezier = new Konva.Line({
            ...bezierPosition,
            strokeWidth: LINE_WIDTH,
            stroke: LINE_COLOR,
            id: 'bezierLinePath',
            opacity: LINE_OPACITY,
            lineCap: 'round',
            lineJoin: 'round',
            bezier: true
        });
        layer.add(childNode.konva.bezier);
        drawLevel({
            levelDepth: levelDepth + 1,
            node: childNode,
            parentPosition: childPosition,
            parentDegree: degree
        })
        layer.add(childNode.konva.caption)
        
        layer.add(childNode.konva.circle);
        
    }
}

function handleClick(node, parentNode) {
    return () => moveViewTo(node, parentNode)
}

function moveViewTo(node, to, speed = 1) {
    edgeBeziers.forEach(bezier => {
        if (bezier.parent !== node) {
            bezier.konva.to({
                opacity: 0,
                duration: MOVE_DURATION,
                onFinish() {
                    bezier.konva.destroy()
                }
            })
        }
    })

    moveAnimationDirection = getUnitVectorFromAToB(
        currentCoordinates.x,
        currentCoordinates.y,
        to.x,
        to.y
    )
    animationTarget = to
    animationDistance = calculateDistance(
        currentCoordinates.x,
        currentCoordinates.y,
        to.x,
        to.y
    )
    if (!animationDistance) {
        console.log('drawTree', node)
        drawTree(node)
        return
    }
    
    //drawTree(node, true)
    moveAnimation = new Konva.Animation(function (frame) {

        const distanceToTarget = calculateDistance(
            currentCoordinates.x,
            currentCoordinates.y,
            to.x,
            to.y
        )
        const moveLength = frame.timeDiff * speed * mapDistanceToAnimationSpeed(
            animationDistance - distanceToTarget,
            animationDistance
        )
        
        if (distanceToTarget < moveLength) {
            moveAnimation.stop()
            
            hideAncestorNodes(node, node, () => {
                
                const areChildrenRendered = node.children[0] && !!node.children[0].konva
                moveEdgeBeziersOfNodeToRootPositions(node)
                if (areChildrenRendered) drawTree(node, true)
                else {
                    
                    node.konva.circle.to({
                        x: centerX,
                        y: centerY,
                        duration: MOVE_DURATION,
                        easing: Konva.Easings.EaseInOut
                    })
                    node.konva.caption.to({
                        x: centerX - (node.name.length * 3.5),
                        y: centerY + 50,
                        duration: MOVE_DURATION,
                        easing: Konva.Easings.EaseInOut
                    })
                }
                
                layer.to({
                    offsetX: 0,
                    offsetY: 0,
                    duration: MOVE_DURATION,
                    easing: Konva.Easings.EaseInOut
                })
                setCurrentCoordinates({
                    x: 0,
                    y: 0
                })
                setTimeout(() => {
                    drawTree(node)
                }, MOVE_DURATION * 1000)
                   
            })
            return
        }

        const moveVector = {
            x: moveAnimationDirection.x * moveLength,
            y: moveAnimationDirection.y * moveLength
        }

        setCurrentCoordinates({
            x: currentCoordinates.x - centerX + moveVector.x,
            y: currentCoordinates.y - centerY + moveVector.y
        })
        layer.offsetX(currentCoordinates.x - centerX)
        layer.offsetY(currentCoordinates.y - centerY)

      }, layer);
    moveAnimation.start()
}

function mapDistanceToAnimationSpeed(distanceFromBeginning, animationDistance, baseSpeed = 0.2) {
    const distanceTravelledRatio = distanceFromBeginning/animationDistance
    const sinRatio = Math.PI * distanceTravelledRatio
    return Math.sin(sinRatio) + baseSpeed
}

function setCurrentCoordinates(position) {
    currentCoordinates = {
        x: position.x + centerX,
        y: position.y + centerY
    }
}

function assignParents(node, parent = null) {
    node.parent = parent

    node.children.forEach(child => assignParents(child, node))
}



function moveEdgeBeziersOfNodeToRootPositions(node) {
    console.log(edgeBeziers)
    console.log(">>>moveEdgeBeziersOfNodeToRootPositions")
    const relevelantBeziers = edgeBeziers.filter(bezier => bezier.parent === node)
    relevelantBeziers.forEach((bezier, index) => {
        console.log('animating bezier')
        const childDegree = (index / node.children.length) * Math.PI * 2
        
        const childPosition = pointAlongCircle({
            position: {
                x: centerX,
                y: centerY
            },
            size: LEVELS_DISTANCE,
            degree: childDegree
        })
        bezier.konva.to({
            points: [
                centerX,
                centerY,
                centerX,
                centerY,
                centerX,
                centerY,
                childPosition.x,
                childPosition.y,
            ],
            duration: MOVE_DURATION,
            easing: Konva.Easings.EaseInOut,
            onFinish() {
                //bezier.konva.destroy()
                edgeBeziers = []
            }
        })
    })
}


function drawAndDecorateNode(node, position, childNode) {
    const circle = drawAndDecorateNodeCircle(position)
    const caption = drawCaption(node.name, {
        x: position.x,
        y: position.y + 50
    })
    circle.on('click tap', handleClick(node, position))
    node.konva = {
        circle,
        caption,
        bezier: null
    }
}

function drawCaption(text, captionCenter) {
    const childCaption = new Konva.Text({
        x: captionCenter.x - (text.length * 3.5),
        y: captionCenter.y,
        text,
        fill: TEXT_COLOR,
        align: 'center',
        fontStyle: 'bold'
    })
    childCaption.transformsEnabled('position')
    return childCaption
}


function drawAndDecorateNodeCircle(circlePosition) {
    const nodeCircle = new Konva.Circle({
        ...circlePosition,
        radius: FIRST_LEVEL_NODE_SIZE,
        fill: CIRCLE_FILL_COLOR,
        stroke: CIRCLE_BORDER_COLOR,
        strokeWidth: CIRCLE_BORDER_WIDTH,
    })
    nodeCircle.transformsEnabled('position')
    return nodeCircle
}

function animateNodeToNewCoordinates(node, newPosition, bezierData = null) {
    node.konva.circle.to({
        ...newPosition,
        duration: MOVE_DURATION,
        easing: Konva.Easings.EaseInOut
    })
    node.konva.caption.to({
        x: newPosition.x - (node.name.length * 3.5),
        y: newPosition.y + 50,
        duration: MOVE_DURATION,
        easing: Konva.Easings.EaseInOut
    })
    if (bezierData) {
        node.konva.bezier.to({
            points: [...bezierData],
            duration: MOVE_DURATION,
            easing: Konva.Easings.EaseInOut
        })
    }
}


// MATH UTILITY FUNCTIONS

function pointAlongCircle({
    position,
    size,
    degree
}) {
    return {
        x: size * Math.sin(degree) + position.x,
        y: size * Math.cos(degree) + position.y
    }
}

function isEven(number) {
    return number % 2 === 0
}

function calculateDistance(aX, aY, bX, bY) {
    const xDifference = Math.abs(aX - bX)
    const yDifference = Math.abs(aY - bY)
    const pythagorasASquared = xDifference ? xDifference ** 2 : 0
    const pythagorasBSquared = yDifference ? yDifference ** 2 : 0
    return Math.sqrt(pythagorasASquared + pythagorasBSquared)
 }

function getUnitVectorFromAToB(aX, aY, bX, bY) {
    const vector = getVectorFromAToB(aX, aY, bX, bY) 
    return convertVectorToUnitVector(vector.x, vector.y)
 }

 function convertVectorToUnitVector(x, y) {
    const length = calculateDistance(0, 0, x, y)
    const proportionToScaleDown = 1 / length
    return {
        x: x * proportionToScaleDown,
        y: y * proportionToScaleDown
    }
 }

 function getVectorFromAToB(aX, aY, bX, bY) {
    const xDifference = bX - aX
    const yDifference = bY - aY
    return {x: xDifference, y: yDifference}
}
