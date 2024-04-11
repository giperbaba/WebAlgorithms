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

let vertices = [];
let pheromones = [];
let distances = [];
let allWays = [];

//let neighborCellColor = "#5F6366";
//let finishPathColor = "#EDB5BF";

function drawPoint(x, y, r) {
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2);
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
    context.arc(vert.x, vert.y, vertexRadius, 0, Math.PI * 2);
    context.fillStyle = vertexColor;
    context.fill();
  }
}

function drawNewPath(oldWay, newWay) {
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

function drawPath(way, color) {
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
  pheromones = [];
  distances = [];
  allWays = [];
  QValue = document.getElementById('QValue').value;
  alfaValue = document.getElementById('alfaValue').value;
  betaValue = document.getElementById('betaValue').value;
}

//---------------------antAlgorithm---------------------

let countOfIterations = 1000;
let countOfAnts = vertices.length;

const evaporation = 0.3; //коэфициэнт испарения
const initialPheromones = 0.2; //начальное количество феромона на ребрах

let QValue = parseFloat(document.getElementById('QValue').value);
let alfaValue = parseInt(document.getElementById('alfaValue').value);
let betaValue = parseInt(document.getElementById('betaValue').value);

class Point {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  distanceTo(otherPoint) {
    let deltaX = this.x - otherPoint.x;
    let deltaY = this.y - otherPoint.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }
}

class Way {
  constructor(length) {
    this.length = length;
    this.path = []; //points
    this.pathIndexes = []; //indexes of this points
    this.distance = 0;
  }

  add(point, index) {
    this.path.push(point);
    this.pathIndexes.push(index);
  }

  getDistance() {
    for (let i = 0; i < this.length - 1; i++) {
      this.distance += this.path[i].distanceTo(this.path[i + 1]);
    }
    this.distance += this.path[this.length - 1].distanceTo(this.path[0]);
  }
}

function getRandomValue(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getWish(from, to) {
  return Math.pow(pheromones[from][to], alfaValue) * Math.pow(distances[from][to], betaValue);
}

function wait(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function antAlgorithm() {
  //-----add first way-----
  let bestWay = new Way(vertices.length);

  for (let i = 0; i < vertices.length; i++) {
    bestWay.add(vertices[i], i);
    pheromones[i] = new Array(vertices.length);
    distances[i] = new Array(vertices.length);
  }

  bestWay.getDistance();

  for (let i = 0; i < vertices.length - 1; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      distances[i][j] = QValue / vertices[i].distanceTo(vertices[j]);
      pheromones[i][j] = initialPheromones;
    }
  }

  //-----main-----
  for (let iteration = 0; iteration < countOfIterations; iteration++) {

    for (let ant = 0; ant < countOfAnts; ant++) {

      let currentWay = new Way(vertices.length);
      let startVertex = vertices[ant];
      let startVertexIndex = ant;
      currentWay.add(startVertex, startVertexIndex);

      while (currentWay.path.length !== vertices.length) {
        let allWishes = []; //[index, wish]
        let wish = 0;
        let commonWish = 0;

        for (let i = 0; i < vertices.length; i++) {
          if (currentWay.pathIndexes.indexOf(i) === -1) {
            let min = Math.min(startVertexIndex, i);
            let max = Math.max(startVertexIndex, i);
            wish = getWish(min, max);
            allWishes.push([i, wish]);
            commonWish += wish;
          }
        }

        for (let i = 0; i < allWishes.length; i++) {
          allWishes[i][1] = allWishes[i][1] / commonWish;
        }

        for (let j = 1; j < allWishes.length; j++) {
          allWishes[j][1] += allWishes[j - 1][1];
        }

        let rand = Math.random();
        let nextVertexIndex;
        for (let i = 0; i < allWishes.length; i++) {
          if (rand < allWishes[i][1]) {
            nextVertexIndex = allWishes[i][0];
            break;
          }
        }

        let nextVertex = vertices[nextVertexIndex];
        currentWay.add(nextVertex, nextVertexIndex);
        currentWay.getDistance();
      }
      allWays.push(currentWay);
    }

    allWays.sort(function (a, b) {
      return a.distance - b.distance
    });

    //-----update pheromones-----
    for (let i = 0; i < vertices.length - 1; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        pheromones[i][j] *= evaporation;
      }
    }

    for (let i = 0; i < allWays.length; i++) {
      let pathWithIndexes = allWays[i].pathIndexes;
      let lengthOfPath = allWays[i].distance;
      for (let j = 0; j < vertices.length - 1; j++) {
        let min = Math.min(pathWithIndexes[j], pathWithIndexes[j + 1]);
        let max = Math.max(pathWithIndexes[j], pathWithIndexes[j + 1]);
        pheromones[min][max] += QValue / lengthOfPath;
      }
    }

    let newBestWay = new Way(vertices.length);

    newBestWay.path = allWays[0].path;
    newBestWay.pathIndexes = allWays[0].pathIndexes;
    newBestWay.getDistance();

    if (newBestWay.distance < bestWay.distance) {
      drawNewPath(bestWay, newBestWay);
      Object.assign(bestWay, newBestWay);
      drawAllPoints();
    }
  }
  drawPath(bestWay, finishPathColor);
}

//---------------------buttons---------------------
let add = document.getElementById('add');
let begin = document.getElementById('begin');

document.getElementById('begin').onclick = antAlgorithm;

document.addEventListener('DOMContentLoaded', function () {
  refresh();
});

let flag = true;
add.addEventListener('click', function () {
  flag = true;
});

begin.addEventListener('click', function () {
  antAlgorithm();
});

canvas.addEventListener('click', function (event) {
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
