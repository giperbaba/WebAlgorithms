let canvas = document.getElementById('canvas');
let context = canvas.getContext("2d");

let canvasWidth = window.getComputedStyle(canvas).getPropertyValue("width");
let canvasWidthNum = parseInt(canvasWidth.replace("px", ""));

canvas.width = canvasWidthNum;
canvas.height = canvas.width;

const paddingJS = 3;

let mazeColor = "#4E4E50";
let startCellColor = "#4D6D9A";
let citiesColor = "#99C";

let pheromonePathColor = "#99CED3";
let neighborCellColor = "#5F6366";
let finishPathColor = "#EDB5BF";

let radius = 6;
let vertices = [];
let visited = [];
let matrix = [];
let countOfAnts = 10000;
let pheromonePathWidth = 1;

let add = document.getElementById('add');
let QValue = document.getElementById('QValue');
let alfaValue = document.getElementById('alfaValue');
let betaValue = document.getElementById('betaValue');


class Point {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  distanceTo(otherPoint) {
    const deltaX = this.x - otherPoint.x;
    const deltaY = this.y - otherPoint.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }
}

function drawPoint(x, y, r) {
  context.beginPath();
  context.arc(x, y,  r, 0,Math.PI * 2);
  context.fillStyle = mazeColor;
  context.fill();
  let currentPoint = new Point(x, y, r);

  if (vertices.length >= 1) {
    for (let vert of vertices) {
      context.moveTo(currentPoint.x, currentPoint.y);
      context.lineTo(vert.x, vert.y);
      context.strokeStyle = pheromonePathColor;
      context.lineWidth = pheromonePathWidth;
      context.stroke();
    }
  }
  vertices.push(currentPoint);
  drawAllPoints();
}

function drawAllPoints() {
  for (let vert of vertices) {
    context.beginPath();
    context.arc(vert.x, vert.y,  radius, 0,Math.PI * 2);
    context.fillStyle = mazeColor;
    context.fill();
  }
}

function refresh() {
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.fill();
  vertices = [];
  visited = [];
}

function getRandomValue(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function createMatrix(size) {
  let matrix = new Array(size);

  for (let x = 0; x < size; x++) {
    let temp = new Array(size);
    for (let y = 0; y < size; y++) {
      let distance = new Point(x, y, radius);
      temp[y] = false;
    }
    matrix[x] = temp;
  }
  return matrix;
}

//---------------------buttons---------------------

document.addEventListener('DOMContentLoaded', function () {
  refresh();
});

let flag = true;
add.addEventListener('click', function () {
  flag = true;
});

canvas.addEventListener('click', function(event) {
  if (flag) {
    let x = event.offsetX;
    let y = event.offsetY;
    drawPoint(x, y, radius);
  }
});


function updateValueQ(value) {
  QValue.innerText = value;
}

function updateValueAlfa(value) {
  alfaValue.innerText = value;
}

function updateValueBeta(value) {
  betaValue.innerText = value;
}
