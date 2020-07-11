
const LEVELS_DISTANCE = 300
const FIRST_LEVEL_NODES = 5
const FIRST_LEVEL_NODE_SIZE = 40
const LINE_WIDTH = 2
const LINE_OPACITY = 1
const LINE_COLOR = '#333333'



const MAX_CHILDREN = 5
const CIRCLE_BORDER_WIDTH = 3
const CIRCLE_BORDER_COLOR = '#222222'
const CIRCLE_FILL_COLOR = '#bb1111'
const CHILDREN_SPREAD_FACTOR = 1.2
const MAX_LEVEL_DEPTH = 2



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

fetch('./knowledgeNetwork.json')
    .then(response => response.json())
    .then(knowledgeNetwork => {
        // TODO render network from dummy data
        //console.log(knowledgeNetwork)
        stage.add(layer);
        assignParents(knowledgeNetwork)
        drawTree(knowledgeNetwork)
    })




function drawTree(rootNode) {
    layer.destroyChildren()
    const rootCircle = new Konva.Circle({
        x: centerX,
        y: centerY,
        radius: FIRST_LEVEL_NODE_SIZE,
        fill: CIRCLE_FILL_COLOR,
        stroke: CIRCLE_BORDER_COLOR,
        strokeWidth: CIRCLE_BORDER_WIDTH,
    });
    const rootCaption = new Konva.Text({
        text: rootNode.name,
        fill: 'white',
        x: centerX - (rootNode.name.length * 3.5),
        y: centerY + 50,
        align: 'center'
    })

    if (rootNode.parent)
        rootCircle.on('click', handleClick(rootNode.parent, {x: centerX, y: centerY}))
    drawBranches(rootNode, true)
    layer.add(rootCircle)
    layer.add(rootCaption)
    layer.draw()
}

function drawBranches(rootNode) {
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
        const child = new Konva.Circle({
            ...childPosition,
            radius: FIRST_LEVEL_NODE_SIZE,
            fill: CIRCLE_FILL_COLOR,
            stroke: CIRCLE_BORDER_COLOR,
            strokeWidth: CIRCLE_BORDER_WIDTH,
            bezier: true,
            strokeWidth: 2
        });
        child.on('click', handleClick(childrenNode, childPosition))
        const childCaption = new Konva.Text({
            text: childrenNode.name,
            fill: 'white',
            x: childPosition.x - (childrenNode.name.length * 3.5),
            y: childPosition.y + 50,
            align: 'center'
        })
    
        var bezierLinePath = new Konva.Line({
            strokeWidth: LINE_WIDTH,
            stroke: LINE_COLOR,
            lineCap: 'round',
            id: 'bezierLinePath',
            opacity: LINE_OPACITY,
            points: [centerX, centerY, childPosition.x, childPosition.y, centerX, centerY],
          });
        drawLevel({
            levelDepth: 2,
            node: childrenNode,
            parentPosition: childPosition,
            parentDegree: childDegree
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
    parentDegree
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
       
        if (levelDepth === MAX_LEVEL_DEPTH + 1) {
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
                    'rgba(0,0,0,0)'
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
            continue
        }
        const bezierLinePath = new Konva.Line({
            strokeWidth: LINE_WIDTH,
            stroke: LINE_COLOR,
            id: 'bezierLinePath',
            opacity: LINE_OPACITY,
            lineCap: 'round',
            lineJoin: 'round',
            bezier: true,
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
        const childCaption = new Konva.Text({
            text: childNode.name + ' ' + levelDepth,
            fill: 'white',
            x: childPosition.x - (childNode.name.length * 3.5),
            y: childPosition.y + 50,
            align: 'center'
        })
        const child = new Konva.Circle({
            ...childPosition,
            radius: FIRST_LEVEL_NODE_SIZE,
            fill: CIRCLE_FILL_COLOR,
            stroke: CIRCLE_BORDER_COLOR,
            strokeWidth: CIRCLE_BORDER_WIDTH
        });
    
        child.on('click', handleClick(childNode, childPosition))

        for (let subChild of childNode.children) {
            drawLevel({
                levelDepth: levelDepth + 1,
                node: subChild,
                parentPosition: childPosition,
                parentDegree: degree
            })
        }
        layer.add(childCaption)
        
        layer.add(child);
        
    }
}

function handleClick(node, parentNode, nodeCoordinates) {
    return () => moveViewTo(node, parentNode, nodeCoordinates)
}


function moveViewTo(node, to, speed = 1) {
    
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
            drawTree(node)
            setCurrentCoordinates({
                x: 0,
                y: 0
            })
            layer.offsetX(0)
            layer.offsetY(0)
            
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