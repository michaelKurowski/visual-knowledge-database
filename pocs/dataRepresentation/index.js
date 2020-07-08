
const LEVELS_DISTANCE = 120
const FIRST_LEVEL_NODES = 10
const FIRST_LEVEL_NODE_SIZE = 10

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
    radius: 20,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4,
});


let i = 30
for (let i = 0 ; i <= FIRST_LEVEL_NODES ; i++) {

    const childDegree = (i / 10) * Math.PI * 2
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
        strokeWidth: 4,
        bezier: true
    });

    var bezierLinePath = new Konva.Line({
        strokeWidth: 3,
        stroke: 'silver',
        lineCap: 'round',
        id: 'bezierLinePath',
        opacity: 0.3,
        points: [centerX, centerY, childPosition.x, childPosition.y, centerX, centerY],
      });
    const countOfChildren = Math.round(Math.random() * 5)
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
    while (i--) {
        
        const degree = isEven(i) ? parentDegree + i / 10 : parentDegree - (i - 1) / 10
        console.log(countOfChildren, i, offset, degree + offset)
        const childPosition = pointAlongCircle({
            position: {
                x: centerX,
                y: centerY
            },
            size: LEVELS_DISTANCE * levelDepth,
            degree: countOfChildren === 1 ? parentDegree : degree + offset
        })
        const child = new Konva.Circle({
            ...childPosition,
            radius: 5,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 4,
            bezier: true
        });
    
        var bezierLinePath = new Konva.Line({
            strokeWidth: 2,
            stroke: 'silver',
            lineCap: 'round',
            id: 'bezierLinePath',
            opacity: 0.3,
            points: [
                parentPosition.x,
                parentPosition.y,
                childPosition.x,
                childPosition.y,
                parentPosition.x,
                parentPosition.y
            ],
        });
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