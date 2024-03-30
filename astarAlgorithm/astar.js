const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");

let canvasWidth = window.getComputedStyle(canvas).getPropertyValue("width");
let canvasWidthNum = parseInt(canvasWidth.replace("px", ""));

canvas.width = canvasWidthNum;
canvas.height = canvas.width;

let matrix;

let start = document.getElementById('start');
let finish = document.getElementById('finish');
let erase = document.getElementById('erase');
let wall = document.getElementById('wall');
let begin = document.getElementById('begin');

const paddingJS = 3;
let columns = document.getElementById("sizeM").value;
let rows = columns;
let cellSize = (canvas.width - paddingJS * 2) / columns;

let startCellColor = "#5d001E";
let finishCellColor = "#EE4C7C";
let mazeColor = "rosybrown";

let startClicker = false;
let finishClicker = false;
let eraseClicker = false;
let wallClicker = false;

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let startCell = new Cell(null, null);
let finishCell = new Cell(null, null);

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

function createMatrix(columns, rows) {
  let matrix = new Array(columns);

  for (let y = 0; y < rows; y++) {
    let column = new Array(rows);
    for (let x = 0; x < columns; x++) {
      column[x] = false;
    }
    matrix[y] = column;
  }
  return matrix;
}

function drawMaze() {
  if (startCell.x !== null) {
    drawCell(startCell.x, startCell.y, startCellColor);
  }
  if (finishCell.x !== null) {
    drawCell(finishCell.x, finishCell.y, finishCellColor);
  }

  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = mazeColor;
  context.fill();
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix.length; x++) {
      const color = (matrix[y][x]) ? "white" : mazeColor;
      drawCell(x, y, color);
    }
  }
}

function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

function isValidMove(x, y, matrix) {
  return x >= 0 && x < rows && y >= 0 && y < columns && !matrix[x][y];
}

function getMazeMatrix(matrix) {
  let stack = [];

  let startCell = new Cell(0,0);
  matrix[startCell.x][startCell.y] = true;
  stack.push(startCell);

  while (stack.length > 0) {
    let currentCell = stack.pop();

    let neighbors = [];

    const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]];

    for ([dx, dy] of directions) {
      let x = currentCell.x + dx;
      let y = currentCell.y + dy;

      if (isValidMove(x, y, matrix)) {
        neighbors.push(new Cell(x, y));
      }
    }

    if (neighbors.length === 0) {
      stack.pop();
    }
    else {
      stack.push(currentCell);

      let index = getRandomIndex(neighbors);
      let nextCell = neighbors[index];
      let wallX = parseInt(currentCell.x + (nextCell.x - currentCell.x) / 2);
      let wallY = parseInt(currentCell.y + (nextCell.y - currentCell.y) / 2);

      matrix[wallX][wallY] = true;
      matrix[nextCell.x][nextCell.y] = true;
      stack.push(nextCell);
    }
  }
  return matrix;
}

function isValidMaze(matrix) {
  for (let y = 0; y < matrix.length; y += 2) {
    for (let x = 0; x < matrix.length; x += 2) {
      if (!matrix[y][x]) {
        return false;
      }
    }
  }
  return true;
}

function generateMaze() {
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = mazeColor;
  context.fill();

  columns = document.getElementById("sizeM").value;
  matrix = createMatrix(columns, columns);

  while (!isValidMaze(matrix)) {
    matrix = getMazeMatrix(matrix);
  }
  drawMaze();
  requestAnimationFrame(clickButton);
}

function main(){
  while (!isValidMaze(matrix)) {
    matrix = getMazeMatrix(matrix);
    requestAnimationFrame(clickButton);
  }
  drawMaze(matrix);
}

function refresh() {
  columns = document.getElementById("sizeM").value;
  matrix = createMatrix(columns, columns);
  cellSize = (canvas.width - paddingJS * 2) / columns;

  startCell = new Cell(null, null);
  finishCell = new Cell(null, null);

  startClicker = false;
  finishClicker = false;
  eraseClicker = false;
  wallClicker = false;

  main();
}

function clickButton() {

  start.addEventListener('click', function () {
    startClicker = true;
    finishClicker = false;
    eraseClicker = false;
    wallClicker = false;

    canvas.addEventListener('mousedown', function (e) {
      if (startClicker && !finishClicker && !eraseClicker && !wallClicker) {
        let coordinateX = e.pageX - this.offsetLeft;
        let coordinateY = e.pageY - this.offsetTop;

        let x = Math.trunc(coordinateX / cellSize);
        let y = Math.trunc(coordinateY / cellSize);

        if (matrix[y][x] && (finishCell.x !== x || finishCell.y !== y)) {
          startCell.x = x;
          startCell.y = y;
          drawCell(startCell.x, startCell.y, startCellColor);
        }
      }
    });
  });

  finish.addEventListener('click', function () {
    startClicker = false;
    finishClicker = true;
    eraseClicker = false;
    wallClicker = false;

    canvas.addEventListener('mousedown', function (e) {
      if (!startClicker && finishClicker && !eraseClicker && !wallClicker) {
        let coordinateX = e.pageX - this.offsetLeft;
        let coordinateY = e.pageY - this.offsetTop;

        let x = Math.trunc(coordinateX / cellSize);
        let y = Math.trunc(coordinateY / cellSize);

        if (matrix[y][x] && (startCell.x !== x || startCell.y !== y)) {
          finishCell.x = x;
          finishCell.y = y;
          drawCell(finishCell.x, finishCell.y, finishCellColor);
        }
      }
    });
  });

  erase.addEventListener('click', function () {
    startClicker = false;
    finishClicker = false;
    eraseClicker = true;
    wallClicker = false;

    canvas.addEventListener('mousedown', function (e) {
      if (!startClicker && !finishClicker && eraseClicker && !wallClicker) {
        let coordinateX = e.pageX - this.offsetLeft;
        let coordinateY = e.pageY - this.offsetTop;

        let x = Math.trunc(coordinateX / cellSize);
        let y = Math.trunc(coordinateY / cellSize);

        if (!matrix[y][x]) {
          matrix[x][y] = true;
          drawCell(x, y, "white");
        }
      }
    });
  });

  wall.addEventListener('click', function () {
    startClicker = false;
    finishClicker = false;
    eraseClicker = false;
    wallClicker = true;

    canvas.addEventListener('mousedown', function (e) {
      if (!startClicker && !finishClicker && !eraseClicker && wallClicker) {
        let coordinateX = e.pageX - this.offsetLeft;
        let coordinateY = e.pageY - this.offsetTop;

        let x = Math.trunc(coordinateX / cellSize);
        let y = Math.trunc(coordinateY / cellSize);

        if (matrix[y][x]) {
          matrix[x][y] = false;
          drawCell(x, y, mazeColor);
        }
      }
    });
  });
}
