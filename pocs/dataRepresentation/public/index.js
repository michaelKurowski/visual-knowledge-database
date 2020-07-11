
const LEVELS_DISTANCE = 300
const FIRST_LEVEL_NODES = 5
const FIRST_LEVEL_NODE_SIZE = 40
const LINE_WIDTH = 2
const LINE_OPACITY = 0.2
const MAX_CHILDREN = 5
const CIRCLE_BORDER_WIDTH = 2
const CIRCLE_BORDER_COLOR = 'rgba(255,255,255,0.3)'

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

const parent = new Konva.Circle({
    x: centerX,
    y: centerY,
    radius: FIRST_LEVEL_NODE_SIZE,
    fill: 'red',
    stroke: CIRCLE_BORDER_COLOR,
    strokeWidth: CIRCLE_BORDER_WIDTH,
});

parent.on('click', handleClick({x: centerX, y: centerY}))


let currentCoordinates = {x: centerX, y: centerY}
let moveAnimation = null
let moveAnimationDirection = null
let animationTarget = null
let animationDistance = null

fetch('./knowledgeNetwork.json')
    .then(response => response.json())
    .then(knowledgeNetwork => {
        // TODO render network from dummy data
        console.log(knowledgeNetwork)
        drawBranches(knowledgeNetwork, true)
        layer.draw()
    })

stage.add(layer);


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
            fill: 'red',
            stroke: CIRCLE_BORDER_COLOR,
            strokeWidth: CIRCLE_BORDER_WIDTH,
            bezier: true
        });
        child.on('click', handleClick(childPosition))
        const childCaption = new Konva.Text({
            text: childrenNode.name,
            fill: 'white',
            x: childPosition.x - (childrenNode.name.length * 3.5),
            y: childPosition.y + 50,
            align: 'center'
        })
    
        var bezierLinePath = new Konva.Line({
            strokeWidth: LINE_WIDTH,
            stroke: 'silver',
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
    // add the shape to the layer
    layer.add(parent);
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
        const spreadStep = i + 1
        const nextStepDegree = isEven(i) ? parentDegree + spreadStep / 10 : parentDegree - (spreadStep - 1) / 10
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
            fill: 'red',
            stroke: CIRCLE_BORDER_COLOR,
            strokeWidth: CIRCLE_BORDER_WIDTH
        });
    
        child.on('click', handleClick(childPosition))
        var bezierLinePath = new Konva.Line({
            strokeWidth: LINE_WIDTH,
            stroke: 'silver',
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

        for (let subChild of childNode.children) {
            drawLevel({
                levelDepth: levelDepth + 1,
                node: subChild,
                parentPosition: childPosition,
                parentDegree: degree
            })
        }
        layer.add(childCaption)
        layer.add(bezierLinePath);
        layer.add(child);
    }
}



function handleClick(nodeCoordinates) {
    return () => moveViewTo(nodeCoordinates)
}


function moveViewTo(to, speed = 1) {
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
            setCurrentCoordinates({
                x: to.x - centerX,
                y: to.y - centerY
            })
            layer.offsetX(currentCoordinates.x - centerX)
            layer.offsetY(currentCoordinates.y - centerY)
            moveAnimation.stop()
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