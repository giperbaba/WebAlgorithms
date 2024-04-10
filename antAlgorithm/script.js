let canvas = document.getElementById('canvas');
let context = canvas.getContext("2d");

let canvasWidth = window.getComputedStyle(canvas).getPropertyValue("width");
let canvasWidthNum = parseInt(canvasWidth.replace("px", ""));

canvas.width = canvasWidthNum;
canvas.height = canvas.width;

//---------------------drawing---------------------

let vertexColor = "#4E4E50";
let vertexRadius = 6;

let pheromonePathColor = "#99CED3";
let pheromonePathWidth = 1;

let pathColor = "#99C";
let finishPathColor = "#4D6D9A";

//let neighborCellColor = "#5F6366";
//let finishPathColor = "#EDB5BF";

function drawPoint(x, y, r) {
  context.beginPath();
  context.arc(x, y,  r, 0,Math.PI * 2);
  context.fillStyle = vertexColor;
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
    context.arc(vert.x, vert.y,  vertexRadius, 0,Math.PI * 2);
    context.fillStyle = vertexColor;
    context.fill();
  }
}

function drawNewPath (oldWay, newWay) {
  for (let i = 0; i < newWay.path; i++) {
    if (oldWay.path.indexOf(newWay.path[i]) == -1) {
      context.moveTo(newWay.path[i].x, newWay.path[i].y);
      context.lineTo(newWay.path[i + 1].x, newWay.path[i + 1].y);
      context.strokeStyle = pathColor;
      context.lineWidth = pheromonePathWidth + 1;
      context.stroke();
    }

    if (newWay.path.indexOf(oldWay.path[i]) == -1) {
      context.moveTo(oldWay.path[i].x, oldWay.path[i].y);
      context.lineTo(oldWay.path[i + 1].x, oldWay.path[i + 1].y);
      context.strokeStyle = pheromonePathColor;
      context.lineWidth = pheromonePathWidth + 1;
      context.stroke();
    }
  }
}

function drawPath (way, color) {
  for (let i = 0; i < way.path.length - 1; i++) {
    context.moveTo(way.path[i].x, way.path[i].y);
    context.lineTo(way.path[i + 1].x, way.path[i + 1].y);
    context.strokeStyle = color;
    context.lineWidth = pheromonePathWidth + 1;
    context.stroke();
  }
  context.lineTo(way.path[0].x, way.path[0].y);
  context.strokeStyle = color;
  context.lineWidth = pheromonePathWidth + 1;
  context.stroke();
}

function refresh() {
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.fill();
  vertices = [];
  visited = [];
}

//---------------------antAlgorithm---------------------

let vertices = [];
let visited = [];
let matrix = [];
let countOfAnts = 10000;

const evaporation = 0.3; //коэфициэнт испарения
const initialPheromones = 0.2; //начальное количество феромона на ребрах

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

class Way {
  constructor(length, pheromones) {
    this.length = length;
    this.pheromones = pheromones;
    this.path = [];
  }

  addPoint(point) {
    this.path.push(point);
  }
}

function getRandomValue(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function createMatrix(size) {
  let matrix = new Array(size);

  for (let x = 0; x < size; x++) {
    let temp = new Array(size);
    for (let y = 0; y < size; y++) {
      let distance = new Point(x, y, vertexRadius);
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
    drawPoint(x, y, vertexRadius);
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
