let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let canvasWidth = 500;

canvas.width = canvasWidth;
canvas.height = canvas.width;

//---------------------drawing---------------------

let vertexColor = "rgba(10,47,49,0.8)";
let vertexRadius = 9;

let pheromonePathColor = "rgba(137,169,166,0.05)";
let pheromonePathWidth = 0.8;

let finishPathColor = "rgba(10,47,49,0.7)";
let finishPathWidth = 1.5;

let vertices = [];

function drawPoint(x, y) {
  context.beginPath();
  context.arc(x, y, vertexRadius, 0, Math.PI * 2, false);
  context.fillStyle = vertexColor;
  context.fill();

  let currentPoint = new Point(x, y);
  drawPheromone(currentPoint);
  vertices.push(currentPoint);
  drawAllPoints();
}

function drawPheromone (currentPoint) {
  context.strokeStyle = pheromonePathColor;
  context.lineWidth = pheromonePathWidth;
  if (vertices.length >= 1) {
    for (let vert of vertices) {
      context.moveTo(currentPoint.x, currentPoint.y);
      context.lineTo(vert.x, vert.y);
      context.stroke();
    }
  }
}

function drawAllPoints() {
  for (let vert of vertices) {
    context.beginPath();
    context.arc(vert.x, vert.y, vertexRadius, 0, Math.PI * 2);
    context.fillStyle = vertexColor;
    context.fill();
  }
}

function wait(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function drawPath(way, color, index = 1) {
  context.lineWidth = finishPathWidth;
  context.strokeStyle = color;

  if (index < way.path.length) {
    context.beginPath();
    context.moveTo(way.path[index - 1].x, way.path[index - 1].y);
    context.lineTo(way.path[index].x, way.path[index].y);
    context.stroke();

    await wait(200);
    return drawPath(way, color, index + 1);
  }
  else {
    context.lineTo(way.path[0].x, way.path[0].y);
    context.stroke();
    return Promise.resolve();
  }
  clear();
}

function clearPath(way, index = 1) {
  context.lineWidth = pheromonePathWidth;
  context.strokeStyle = pheromonePathColor;

  if (index < way.path.length) {
    context.beginPath();
    context.moveTo(way.path[index - 1].x, way.path[index - 1].y);
    context.lineTo(way.path[index].x, way.path[index].y);
    context.stroke();

    clearPath(way, index + 1);
  }
  else {
    context.lineTo(way.path[0].x, way.path[0].y);
    context.stroke();
  }
}

function refresh() {
  //context.beginPath();
  context.clearRect(0, 0, canvas.width, canvas.height);
  //context.fillStyle = "white";
  //context.fill();

  vertices = [];
  pheromones = [];
  distances = [];
  allWays = [];

  flagFinishAlgorithm = false;
  //window.location.reload();

  alfaValue = parseInt(document.getElementById('𝛼').value);
  betaValue = parseInt(document.getElementById('𝛽').value);
}

//---------------------antAlgorithm---------------------

let countOfIterations = 10000;
let countOfAnts = vertices.length;

const evaporation = 0.64; //коэфициент испарения
const initialPheromones = 0.2; //начальное количество феромона на ребрах

let QValue = 200;
let alfaValue = parseInt(document.getElementById('𝛼').value);
let betaValue = parseInt(document.getElementById('𝛽').value);

let flagFinishAlgorithm = false;

let pheromones = [];
let distances = [];
let allWays = [];

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo(otherPoint) {
    let deltaX = Math.pow(this.x - otherPoint.x, 2);
    let deltaY = Math.pow(this.y - otherPoint.y, 2);
    return Math.sqrt(deltaX + deltaY);
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
    for (let i = 0; i < this.pathIndexes.length - 1; i++) {
      this.distance += vertices[this.pathIndexes[i]].distanceTo(vertices[this.pathIndexes[i + 1]]);
    }
    this.distance += vertices[this.pathIndexes[this.pathIndexes.length - 1]].distanceTo(vertices[this.pathIndexes[0]]);
  }
}

function getWish(from, to) {
  return Math.pow(pheromones[from][to], alfaValue) * Math.pow(distances[from][to], betaValue);
}

let bestWay;

function antAlgorithm() {
  let vertLen = vertices.length;
  //-----add first way-----
  bestWay = new Way(vertLen);

  for (let i = 0; i < vertLen; i++) {
    bestWay.add(vertices[i], i);
    pheromones[i] = new Array(vertLen);
    distances[i] = new Array(vertLen);
  }

  bestWay.getDistance();

  for (let i = 0; i < vertLen - 1; i++) {
    for (let j = i + 1; j < vertLen; j++) {
      distances[i][j] = QValue / vertices[i].distanceTo(vertices[j]);
      pheromones[i][j] = initialPheromones;
    }
  }

  //-----main-----
  let end = vertices.length * 3;

  for (let iteration = 0; iteration < countOfIterations; iteration++) {

    if (end === 0) {
      console.log(bestWay);
      flagFinishAlgorithm = true;
      drawPath(bestWay, finishPathColor);
      return;
    }

    countOfAnts = vertLen;

    for (let ant = 0; ant < countOfAnts; ant++) {

      let currentWay = new Way(vertLen);
      let startVertex = vertices[ant];
      let startVertexIndex = ant;
      currentWay.add(startVertex, startVertexIndex);

      while (currentWay.path.length !== vertLen) {
        let allWishes = []; //[index, wish]
        let commonWish = 0;

        for (let i = 0; i < vertLen; i++) {
          if (currentWay.pathIndexes.indexOf(i) !== -1) {
            continue;
          }
          let min = Math.min(startVertexIndex, i);
          let max = Math.max(startVertexIndex, i);
          let wish = getWish(min, max);
          allWishes.push([i, wish]);
          commonWish += wish;
        }

        for (let i = 0; i < allWishes.length; i++) {
          allWishes[i][1] /= commonWish;
        }

        for (let i = 1; i < allWishes.length; i++) {
          allWishes[i][1] += allWishes[i - 1][1];
        }

        let rand = Math.random();
        let nextVertexIndex;
        for (let i = 0; i < allWishes.length; i++) {
          if (rand < allWishes[i][1]) {
            nextVertexIndex = allWishes[i][0];
            break;
          }
        }
        startVertexIndex =  nextVertexIndex;

        let nextVertex = vertices[startVertexIndex];

        currentWay.add(nextVertex, nextVertexIndex);
      }
      allWays.push(currentWay);
      currentWay.getDistance();
    }

    allWays.sort(function (a, b) {
      return a.distance - b.distance;
    });

    //-----update pheromones-----
    for (let i = 0; i < vertLen - 1; i++) {
      for (let j = i + 1; j < vertLen; j++) {
        pheromones[i][j] *= evaporation;
      }
    }

    for (let i = 0; i < allWays.length; i++) {
      let pathWithIndexes = allWays[i].pathIndexes;
      let distance = allWays[i].distance;
      for (let j = 0; j < vertices.length - 1; j++) {
        let min = Math.min(pathWithIndexes[j], pathWithIndexes[j + 1]);
        let max = Math.max(pathWithIndexes[j], pathWithIndexes[j + 1]);
        pheromones[min][max] += QValue / distance;
      }
    }

    let newBestWay = new Way(vertices.length);


    newBestWay.path = allWays[0].path;
    newBestWay.pathIndexes = allWays[0].pathIndexes;
    newBestWay.getDistance();

    if (newBestWay.distance < bestWay.distance) {
      bestWay.path = newBestWay.path;
      bestWay.pathIndexes = newBestWay.pathIndexes;
      bestWay.distance = newBestWay.distance;
      end = vertices.length * 3;
    }
    end--;
  }
}

//---------------------buttons---------------------
let begin = document.getElementById('begin');

document.addEventListener('DOMContentLoaded', function () {
  refresh();
});

begin.addEventListener('click', function () {
  antAlgorithm();
});

canvas.addEventListener('click', function (event) {
  let x = event.offsetX;
  let y = event.offsetY;
  drawPoint(x, y, vertexRadius);
  if (flagFinishAlgorithm) {
    clearPath(bestWay);
    let tempVertices = vertices.slice();
    refresh();
    vertices = tempVertices;
    for (let i = 0; i < vertices.length; i++) {
      drawPheromone(vertices[i]);
      drawAllPoints();
    }
  }
});

function updateValueAlfa(value) {
  document.getElementById("alfaValue").innerText = value;
}

function updateValueBeta(value) {
  document.getElementById("betaValue").innerText = value;
}

