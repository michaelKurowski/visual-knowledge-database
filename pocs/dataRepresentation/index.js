
const LEVELS_DISTANCE = 250
const FIRST_LEVEL_NODES = 5
const FIRST_LEVEL_NODE_SIZE = 30
const LINE_WIDTH = 2
const LINE_OPACITY = 0.5
const MAX_CHILDREN = 5
const CIRCLE_BORDER_WIDTH = 2

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
    stroke: 'black',
    strokeWidth: CIRCLE_BORDER_WIDTH,
});
parent.on('click', handleClick({x: centerX, y: centerY}))

// Draws only first level of nodes
for (let i = 0 ; i <= FIRST_LEVEL_NODES ; i++) {

    const childDegree = (i / FIRST_LEVEL_NODES) * Math.PI * 2
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
        stroke: 'black',
        strokeWidth: CIRCLE_BORDER_WIDTH,
        bezier: true
    });
    child.on('click', handleClick(childPosition))

    var bezierLinePath = new Konva.Line({
        strokeWidth: LINE_WIDTH,
        stroke: 'silver',
        lineCap: 'round',
        id: 'bezierLinePath',
        opacity: LINE_OPACITY,
        points: [centerX, centerY, childPosition.x, childPosition.y, centerX, centerY],
      });
    const countOfChildren = Math.round(Math.random() * MAX_CHILDREN)
    if (countOfChildren) {
        drawLevel({
            levelDepth: 2,
            countOfChildren,
            parentPosition: childPosition,
            parentDegree: childDegree
        })
    }

    layer.add(bezierLinePath);
    layer.add(child);
}
// add the shape to the layer
layer.add(parent);
// add the layer to the stage
stage.add(layer);


function drawLevel({
    levelDepth,
    countOfChildren,
    parentPosition,
    parentDegree
}) {
    let i = countOfChildren
    const offset = !isEven(countOfChildren) ?  - (1/10) : 0
    const centralPoint = pointAlongCircle({
        position: {
            x: centerX,
            y: centerY
        },
        size: LEVELS_DISTANCE * (levelDepth - 0.5),
        degree: parentDegree
    })
    while (i--) {
        
        const nextStepDegree = isEven(i) ? parentDegree + i / 10 : parentDegree - (i - 1) / 10
        const degree = countOfChildren === 1 ? parentDegree : nextStepDegree + offset
        console.log(countOfChildren, i, offset, degree + offset)
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
        const child = new Konva.Circle({
            ...childPosition,
            radius: FIRST_LEVEL_NODE_SIZE,
            fill: 'red',
            stroke: 'black',
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
        if (Math.random() < 0.2) {
            const countOfChildren = Math.round(Math.random() * MAX_CHILDREN)
            if (countOfChildren) {
                drawLevel({
                    levelDepth: levelDepth + 1,
                    countOfChildren,
                    parentPosition: childPosition,
                    parentDegree: degree
                })
            }
        }
        layer.add(bezierLinePath);
        layer.add(child);
    }
}

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
/*
function handleClick(nodeCoordinates) {
    return () => {
        const anim = new Konva.Animation(function (frame) {
            if ((Math.abs(layer.offsetX() - (nodeCoordinates.x - centerX)) < 100) &&
            (Math.abs(layer.offsetY() - (nodeCoordinates.y - centerY)) < 100 )) {
                return
            }

            layer.offsetX((nodeCoordinates.x - centerX) * (frame.time / 1000))
            layer.offsetY((nodeCoordinates.y - centerY) * (frame.time / 1000))

          }, layer);
        anim.start()
    }
}
*/