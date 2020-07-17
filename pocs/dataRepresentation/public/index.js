
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
        // TODO render network from dummy data
        //console.log(knowledgeNetwork)
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


function drawTree(rootNode, redraw = false) {
    
    const circlePosition = {
        x: centerX,
        y: centerY
    }

    const captionPosition = {
        x: centerX - (rootNode.name.length * 3.5),
        y: centerY + 50
    }

    if (redraw) {
        rootNode.konva.circle.to({
            ...circlePosition,
            duration: MOVE_DURATION,
            easing: Konva.Easings.EaseInOut
        })
        rootNode.konva.caption.to({
            ...captionPosition,
            duration: MOVE_DURATION,
            easing: Konva.Easings.EaseInOut
        })
        drawBranches(rootNode, redraw)
        return
    }
    layer.destroyChildren()
    const rootCircle = new Konva.Circle({
        ...circlePosition,
        radius: FIRST_LEVEL_NODE_SIZE,
        fill: CIRCLE_FILL_COLOR,
        stroke: CIRCLE_BORDER_COLOR,
        strokeWidth: CIRCLE_BORDER_WIDTH,
    });
    const rootCaption = new Konva.Text({
        ...captionPosition,
        text: rootNode.name,
        fill: TEXT_COLOR,
        align: 'center',
        fontStyle: 'bold'
    })

    rootNode.konva = {
        circle: rootCircle,
        caption: rootCaption,
        bezier: null
    }

    if (rootNode.parent)
        rootCircle.on('click tap', handleClick(rootNode.parent, {x: centerX, y: centerY}))
    drawBranches(rootNode, redraw)
    layer.add(rootCircle)
    layer.add(rootCaption)
    layer.draw()
}

function drawBranches(rootNode, redraw = false) {
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
        console.log(childrenNode.name, childPosition, {
            position: {
                x: centerX,
                y: centerY
            },
            size: LEVELS_DISTANCE,
            degree: childDegree
        })
        const captionPosition = {
            x: childPosition.x - (childrenNode.name.length * 3.5),
            y: childPosition.y + 50,
        }
        const bezierPosition = {
            points: [centerX, centerY, childPosition.x, childPosition.y, centerX, centerY]
        }

        if (redraw) {
            childrenNode.konva.circle.to({
                x: childPosition.x,
                y: childPosition.y,
                duration: MOVE_DURATION,
                easing: Konva.Easings.EaseInOut
            })
            childrenNode.konva.caption.to({
                ...captionPosition,
                duration: MOVE_DURATION,
                easing: Konva.Easings.EaseInOut
            })
            childrenNode.konva.bezier.to({
                opacity: 1,
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
                easing: Konva.Easings.EaseInOut
            })
            continue
        }
        const child = new Konva.Circle({
            ...childPosition,
            id: rootNode.name + '-circle',
            radius: FIRST_LEVEL_NODE_SIZE,
            fill: CIRCLE_FILL_COLOR,
            stroke: CIRCLE_BORDER_COLOR,
            strokeWidth: CIRCLE_BORDER_WIDTH
        });
        child.on('click tap', handleClick(childrenNode, childPosition))
        const childCaption = new Konva.Text({
            ...captionPosition,
            text: childrenNode.name,
            id: rootNode.name + '-text',
            fill: TEXT_COLOR,
            align: 'center',
            fontStyle: 'bold'
        })

        var bezierLinePath = new Konva.Line({
            ...bezierPosition,
            strokeWidth: LINE_WIDTH,
            stroke: LINE_COLOR,
            lineCap: 'round',
            id: 'bezierLinePath',
            opacity: LINE_OPACITY,
          });
        childrenNode.konva = {
            circle: child,
            caption: childCaption,
            bezier: bezierLinePath
        }
        drawLevel({
            levelDepth: 2,
            node: childrenNode,
            parentPosition: childPosition,
            parentDegree: childDegree,
            redraw
        })
        layer.add(bezierLinePath);
        layer.add(childCaption)
        layer.add(child);
    }
}

function drawLevel({
    levelDepth,
    node,
    parentPosition,
    parentDegree,
    redraw = false
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
    //console.log('drawLevel node: ', node.name , node)
    for (let i = 0 ; i < countOfChildren ; i++) {
        const childNode = node.children[i]
        console.log('initiating bezier', node.name, childNode.name)

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
        const captionPosition = {
            x: childPosition.x - (childNode.name.length * 3.5),
            y: childPosition.y + 50
        }
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
        //console.log('draw level child: ', childNode.name)
        if (levelDepth === MAX_LEVEL_DEPTH + 1) {
            console.log('Edge Bezier', node.name, childNode.name)
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
            edgeBeziers.push(bezierLinePath)
            
            continue
        }

        if (redraw) {
            node.konva.circle.to({
                ...childPosition,
                duration: MOVE_DURATION,
                easing: Konva.Easings.EaseInOut
            })
            node.konva.bezier.to({
                ...bezierPosition,
                duration: MOVE_DURATION,
                easing: Konva.Easings.EaseInOut
            })
            node.konva.caption.to({
                ...captionPosition,
                duration: MOVE_DURATION,
                easing: Konva.Easings.EaseInOut
            })
            drawLevel({
                levelDepth: levelDepth + 1,
                node: childNode,
                parentPosition: childPosition,
                parentDegree: degree,
                redraw
            })
            continue
        }
        const bezierLinePath = new Konva.Line({
            ...bezierPosition,
            strokeWidth: LINE_WIDTH,
            stroke: LINE_COLOR,
            id: 'bezierLinePath',
            opacity: LINE_OPACITY,
            lineCap: 'round',
            lineJoin: 'round',
            bezier: true
        });
        //console.log('Normal Bezier')
        layer.add(bezierLinePath);
        const childCaption = new Konva.Text({
            ...captionPosition,
            text: childNode.name + ' ' + levelDepth,
            fill: TEXT_COLOR,
            align: 'center',
            fontStyle: 'bold'
        })
        const child = new Konva.Circle({
            ...childPosition,
            radius: FIRST_LEVEL_NODE_SIZE,
            fill: CIRCLE_FILL_COLOR,
            stroke: CIRCLE_BORDER_COLOR,
            strokeWidth: CIRCLE_BORDER_WIDTH
        });
    
        childNode.konva = {
            circle: child,
            caption: childCaption,
            bezier: bezierLinePath
        }
        child.on('click tap', handleClick(childNode, childPosition))

        drawLevel({
            levelDepth: levelDepth + 1,
            node: childNode,
            parentPosition: childPosition,
            parentDegree: degree
        })
        layer.add(childCaption)
        
        layer.add(child);
        
    }
}

function handleClick(node, parentNode, nodeCoordinates) {
    return () => moveViewTo(node, parentNode, nodeCoordinates)
}


function animateTreeSwitch(rootNode, speed = 1) {
    if (!rootNode.parent) return
    let listOfKonvaNodesToAnimate = []
    let listOfKonvaBeziersAnimate = []
    rootNode.parent
}



function moveViewTo(node, to, speed = 1) {
    edgeBeziers.forEach(bezier => {
        bezier.to({
            opacity: 0,
            duration: MOVE_DURATION,
            onFinish() {
                bezier.destroy()
            }
        })
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
                
                if (areChildrenRendered) {
                    drawTree(node, true)
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
                    return
                }
                
                setCurrentCoordinates({
                    x: 0,
                    y: 0
                })
                layer.offsetX(0)
                layer.offsetY(0)
                drawTree(node)
            })
            //drawTree(node)
            /*
            setCurrentCoordinates({
                x: 0,
                y: 0
            })
            layer.offsetX(0)
            layer.offsetY(0)
            */
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