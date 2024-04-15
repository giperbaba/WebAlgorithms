let canvas = document.getElementById('canvas');
let context = canvas.getContext("2d");

let canvasWidth = window.getComputedStyle(canvas).getPropertyValue("width");
let canvasWidthNum = parseInt(canvasWidth.replace("px", ""));

canvas.width = canvasWidthNum;
canvas.height = canvas.width;

//---------------------drawing---------------------

let vertexColor = "#4E4E50";
let vertexRadius = 7;

let pheromonePathColor = "rgba(255,155,170,0.15)";
let pheromonePathWidth = 1;

//let pathColor = "#4D6D9A";
let finishPathColor = "#99C";

let vertices = [];
let pheromones = [];
let distances = [];
let allWays = [];

//let neighborCellColor = "#5F6366";
//let finishPathColor = "#EDB5BF";
//let pheromonePathColor = "#99CED3";


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
  if (vertices.length >= 1) {
    for (let vert of vertices) {
      context.moveTo(currentPoint.x, currentPoint.y);
      context.lineTo(vert.x, vert.y);
      context.strokeStyle = pheromonePathColor;
      context.lineWidth = pheromonePathWidth;
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

function drawNewPath(oldWay, newWay) {
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  /*context.beginPath();
  for (let i = 0; i < newWay.path.length - 1; i++) {
    context.moveTo(newWay.path[i].x, newWay.path[i].y);
    context.lineTo(newWay.path[i + 1].x, newWay.path[i + 1].y);
    context.strokeStyle = pathColor;
    context.lineWidth = pheromonePathWidth + 1;
    context.stroke();
  }

  // Устанавливаем цвет pheromonePathColor
  context.strokeStyle = pheromonePathColor;

  // Рисуем старый путь с цветом pheromonePathColor
  for (let i = 0; i < oldWay.path.length - 1; i++) {
    context.beginPath();
    context.moveTo(oldWay.path[i].x, oldWay.path[i].y);
    context.lineTo(oldWay.path[i + 1].x, oldWay.path[i + 1].y);
    context.lineWidth = pheromonePathWidth + 1;
    context.stroke();
  }*/
}

async function drawPath(way, color, index = 1) {
  context.lineWidth = pheromonePathWidth;
  context.strokeStyle = color;

  if (index < way.path.length) {
    context.beginPath();
    context.moveTo(way.path[index - 1].x, way.path[index - 1].y);
    context.lineTo(way.path[index].x, way.path[index].y);
    context.stroke();

    await wait(200);
    drawPath(way, color, index + 1);
  } else {
    context.lineTo(way.path[0].x, way.path[0].y);
    context.stroke();
  }
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

  alfaValue = parseInt(document.getElementById('𝛼').value);
  betaValue = parseInt(document.getElementById('𝛽').value);
}

//---------------------antAlgorithm---------------------

let countOfIterations = 10000;
let countOfAnts = vertices.length;

const evaporation = 0.3; //коэфициэнт испарения
const initialPheromones = 0.2; //начальное количество феромона на ребрах

let QValue = 200;
let alfaValue = parseInt(document.getElementById('𝛼').value);
let betaValue = parseInt(document.getElementById('𝛽').value);

let flagFinishAlgorithm = false;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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
    for (let i = 0; i < this.pathIndexes.length - 1; i++) {
      this.distance += vertices[this.pathIndexes[i]].distanceTo(vertices[this.pathIndexes[i + 1]]);
    }
    this.distance += vertices[this.pathIndexes[this.pathIndexes.length - 1]].distanceTo(vertices[this.pathIndexes[0]]);
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

  countOfAnts = vertices.length;

  //-----main-----
  let end = vertices.length * 2;

  for (let iteration = 0; iteration < countOfIterations; iteration++) {

    if (end === 0) {
      let min = bestWay.distance;
      for (let i = 0; i < allWays.length; i++) {
        if (allWays[i].distance <= min) {
          min = allWays[i].distance;
        }
      }
      console.log(min);
      console.log(flag);
      console.log(bestWay);
      flagFinishAlgorithm = true;
      drawPath(bestWay, finishPathColor);
      return;
    }

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

        allWishes.sort((a, b) => b - a);

        let rand = Math.random() * commonWish;
        let nextVertexIndex;
        for (let i = 0; i < allWishes.length; i++) {
          rand -= allWishes[i][1];
          if (rand <= 0) {
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
      //drawNewPath(bestWay, newBestWay);
      bestWay.path = newBestWay.path;
      bestWay.pathIndexes = newBestWay.pathIndexes;
      bestWay.distance = newBestWay.distance;
      end = vertices.length * 2;
    }
    end--;
  }
}

//---------------------buttons---------------------
let add = document.getElementById('add');
let begin = document.getElementById('begin');


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

function updateValueAlfa(value) {
  alfaValue.innerText = value;
}

function updateValueBeta(value) {
  betaValue.innerText = value;
}
