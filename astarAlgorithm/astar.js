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
let rows = columns;
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

function createMatrix(columns, rows) {
  let matrix = new Array(columns);

  for (let y = 0; y < rows; y++) { //строки по OY
    let column = new Array(rows);
    for (let x = 0; x < columns; x++) {
      column[x] = false; //false - стена
    }
    matrix[y] = column;
  }
  return matrix;
}

function drawMaze(matrix) {
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "black";
  context.fill();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const color = (matrix[y][x]) ? "white" : "black";
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
  for (let y = 0; y < rows; y += 2) {
    for (let x = 0; x < columns; x += 2) {
      if (!matrix[y][x]) {
        return false;
      }
    }
  }
  return true;
}

let matrix = createMatrix(columns, rows);
while (!isValidMaze(matrix)){
  matrix = getMazeMatrix(matrix);
}

drawMaze(matrix);

