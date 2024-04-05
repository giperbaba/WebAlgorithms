let canvas = document.getElementById('canvas');
let context = canvas.getContext("2d");

let canvasWidth = window.getComputedStyle(canvas).getPropertyValue("width");
let canvasWidthNum = parseInt(canvasWidth.replace("px", ""));

canvas.width = canvasWidthNum;
canvas.height = canvas.width;

const paddingJS = 3;

let mazeColor = "#4E4E50";
let startCellColor = "#4D6D9A";
let finishCellColor = "#99C";

let pathCellColor = "#99CED3";
let neighborCellColor = "#5F6366";
let finishPathColor = "#EDB5BF";

let radius = 6;
let circles = [];

let add = document.getElementById('add');
let QValue = document.getElementById('QValue');
let alfaValue = document.getElementById('alfaValue');
let betaValue = document.getElementById('betaValue');

add.addEventListener('click', function () {
  canvas.addEventListener('click', function(event) {
    let x = event.offsetX; // получаем координату X курсора относительно левого края элемента canvas.
    let y = event.offsetY; //мы получаем координату Y курсора относительно верхнего края элемента canvas.
    drawPoint(x, y, radius);
  });
});

class Point {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
}
function drawPoint(x, y, r) {
  context.beginPath();
  context.arc(x, y,  r, 0,Math.PI * 2);
  context.fillStyle = finishCellColor;
  context.fill();
  let point = new Point(x, y, r); //point - координаты, поставленной точки
  circles.push(point); //обновляем массив с точками после каждой новой нарисованной точки
}

function refresh() {
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.fill();
  circles = [];
}

document.addEventListener('DOMContentLoaded', function () {
  refresh();
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
