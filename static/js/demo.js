let graphPoints;
let numberPoints;
let projection;
let distance = 2;
let yAngle = 0;

let sketchFont;

let nn;
let trainingData;
let epochs = 0;
let isTraining = false;

function preload() {
    sketchFont = loadFont("/static/fonts/FiraCode-Light.otf");
    trainingData = loadJSON("/static/data/training_data.json");
}

function setup() {
    createCanvas(400, 400).class("train__p5-canvas").parent("train__main");
    graphPoints = math.matrix([
        [-0.5, -0.5, -0.5],
        [0.5, -0.5, -0.5],
        [0.5, 0.5, -0.5],
        [-0.5, 0.5, -0.5],
        [-0.5, -0.5, 0.5],
        [0.5, -0.5, 0.5],
        [0.5, 0.5, 0.5],
        [-0.5, 0.5, 0.5]
    ]);
    numberPoints = math.matrix([
        [-0.5, -0.5, -0.5],
        [0.5, 0.5, -0.5],
        [0.5, -0.5, 0.5],
        [-0.5, 0.5, 0.5]
    ]);

    trainingData = Object.values(trainingData);
    nn = new FNN(1e-1, trainingData[0].inputs.length, 3, trainingData[0].outputs.length);
}

function draw() {
    background(169, 168, 168);
    textFont(sketchFont);

    translate(width / 2, height / 2);

    if (isTraining) nn.train(100, trainingData);
    
    let rotationY = math.matrix([
        [math.sin(yAngle), 0, math.cos(yAngle)],
        [0, 1, 0],
        [math.cos(yAngle), 0, -math.sin(yAngle)]
    ]);

    numberPoints._data.forEach(vec => {
        let rotated = math.multiply(rotationY, vec);
        projection = math.matrix([
            [1 / (distance - rotated._data[2]), 0, 0],
            [0, 1 / (distance - rotated._data[2]), 0]
        ]);    
        let projected2D = math.multiply(projection, rotated);
        projected2D = math.dotMultiply(projected2D, 420);
        let textVec = math.add(vec, 0.5);
        textVec.splice(2);
        text(textVec, projected2D._data[0], projected2D._data[1]);
    })

    stroke(0);
    strokeWeight(10);
    noFill();
    
    let projectedPts = [];
    graphPoints._data.forEach(dVec => {
        let rotated = math.multiply(rotationY, dVec);
        projection = math.matrix([
            [1 / (distance - rotated._data[2]), 0, 0],
            [0, 1 / (distance - rotated._data[2]), 0]
        ]);    
        let projected2D = math.multiply(projection, rotated);
        projected2D = math.dotMultiply(projected2D, 400);
        projectedPts.push(projected2D);
    });

    for (let i = 0; i < 4; i++) {
        connect(projectedPts, i, (i + 1) % 4);
        connect(projectedPts, i + 4, ((i + 1) % 4) + 4);
        connect(projectedPts, i, i + 4);
    }

    let cols = 1;
    let rows = 1;
    for (let i = 0; i <= cols; i += 0.04) {
        for (let j = 0; j <= rows; j += 0.04) {
            let inputs = [i, j];
            let guess = nn.guess(inputs);
            inputs.push(guess[0]);
            inputs = math.subtract(inputs, 0.5);
            let rotated = math.multiply(rotationY, inputs);
            projection = math.matrix([
                [1 / (distance - rotated._data[2]), 0, 0],
                [0, 1 / (distance - rotated._data[2]), 0]
            ]); 
            let projected2D = math.multiply(projection, rotated);
            projected2D = math.dotMultiply(projected2D, 390);
            strokeWeight(4);
            if (1 - guess[0] < guess[0]) {
                stroke((guess - 0.5) * 2 * 255, 0, 0);
            } else {
                stroke(0, 0, (0.5 - guess[0]) * 2 * 255);
            } 
            point(projected2D._data[0], projected2D._data[1]);
        }
    }

    translate(-width / 2, -height / 2);

    noStroke();
    fill(169, 168, 168);
    rect(0, 0, 400, 45);

    fill(0);
    textSize(10);
    text('Neural network solving XOR', 5, 10);

    textSize(8);
    text(`Epochs (hundreds): ${epochs}`, 5, 26);
    text(`Loss (mean squared error): ${nn.loss}`, 5, 38);

    text(`fps: ${math.round(frameRate())}`, 360, 395);

    yAngle += 0.001;
    if (isTraining) epochs += 1;
}

const connect = (projectedPts, indexA, indexB) => {
    strokeWeight(0.5);
    stroke(0);
    line(projectedPts[indexA]._data[0], projectedPts[indexA]._data[1], projectedPts[indexB]._data[0], projectedPts[indexB]._data[1]);
}

const toggleTraining = () => {
    if (isTraining) {
        isTraining = false;
        trainingToggle.classList.remove("fa-pause");
        trainingToggle.classList.add("fa-play");
        trainingToggle.classList.remove("train__button--pause");
        trainingToggle.classList.add("train__button--play");

    } else {
        isTraining = true;
        trainingToggle.classList.add("fa-pause");
        trainingToggle.classList.remove("fa-play");
        trainingToggle.classList.add("train__button--pause");
        trainingToggle.classList.remove("train__button--play");
    }
}

const resetSketch = () => {
    nn = new FNN(1e-1, trainingData[0].inputs.length, 4, trainingData[0].outputs.length);
    isTraining = false;
    epochs = 0;
    trainingToggle.classList.remove("fa-pause");
    trainingToggle.classList.add("fa-play");
    trainingToggle.classList.remove("train__button--pause");
    trainingToggle.classList.add("train__button--play");
}