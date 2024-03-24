const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");

let canvasWidth = window.getComputedStyle(canvas).getPropertyValue("width");
let canvasWidthNum = parseInt(canvasWidth.replace("px", ""));

canvas.width = canvasWidthNum;
canvas.height = canvas.width;

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const paddingJS = 5;
let columns = 15;
let cellSize = (canvas.width - paddingJS * 2) / columns;


function drawCell(x, y, color) {
  context.beginPath();
  context.rect (
    paddingJS + x * cellSize,
    paddingJS + y * cellSize,
    cellSize,
    cellSize
  );
  context.fillStyle = color;
  context.fill();
}









