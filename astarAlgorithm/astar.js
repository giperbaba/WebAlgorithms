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

function getMazeMatrix(matrix) {
  let x = 0, y = 0;
  matrix[x][y] = true;
  let toCheck = [];

  if (y - 2 >= 0) {
    let toCheckCell = new Cell(x, y - 2);
    toCheck.push(toCheckCell);
  }
  if (y + 2 < rows) {
    let toCheckCell = new Cell(x, y + 2);
    toCheck.push(toCheckCell);
  }
  if (x - 2 >= 0) {
    let toCheckCell = new Cell(x - 2, y);
    toCheck.push(toCheckCell);
  }
  if (x + 2 < columns) {
    let toCheckCell = new Cell(x + 2, y);
    toCheck.push(toCheckCell);
  }

  while (toCheck.length > 0) {
    let index = getRandomIndex(toCheck);
    let newCell = toCheck[index];
    x = newCell.x;
    y = newCell.y;
    matrix[x][y] = true;
    toCheck.splice(index, 1);

    let directions = [[x, y + 2], [x, y - 2], [x - 2, y], [x + 2, y]];
    let randomDirection = getRandomIndex(directions);
    switch (randomDirection) {
      case 0: //north
        if (y + 2 < rows && matrix[x][y + 2]) {
          matrix[x][y + 1] = true;
          directions.splice(0, directions.length);
        }
        break;
      case 1: //south
        if (y - 2 >= 0 && matrix[x][y - 2]) {
          matrix[x][y - 1] = true;
          directions.splice(0, directions.length);
        }
        break;
      case 2: //west
        if (x - 2 >= 0 && matrix[x - 2][y]) {
          matrix[x - 1][y] = true;
          directions.splice(0, directions.length);
        }
        break;
      case 3: //east
        if (x + 2 < columns && matrix[x + 2][y]) {
          matrix[x + 1][y] = true;
          directions.splice(0, directions.length);
        }
        break;
    }
    directions.splice(index, 1);
  if (y + 2 < columns && !matrix[x][y + 2]) {
    toCheck.push(new Cell(x, y + 2));
  }
  if (y - 2 >= 0 && !matrix[x][y - 2]) {
    toCheck.push(new Cell(x, y - 2));
  }
  if (x + 2 < rows && !matrix[x + 2][y]) {
    toCheck.push(new Cell(x + 2, y));
  }
  if (x - 2 >= 0 && !matrix[x - 2][y]) {
    toCheck.push(new Cell(x - 2, y));
  }
  }
  /*
  for (let count = 0; count < 4; count++) {
    let deadEnds = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        if (matrix[y][x]) {
          let neighbors = 0;
          if (y - 1 >= 0 && matrix[x][y - 1]) {
            neighbors++;
          }
          if (y + 1 < rows && matrix[x][y + 1]) {
            neighbors++;
          }
          if (x - 1 >= 0 && matrix[x - 1][y]) {
            neighbors++;
          }
          if (x + 1 >= 0 && matrix[x + 1][y]) {
            neighbors++;
          }
          if (neighbors <= 1) {
            deadEnds.push(new Cell(y, x));
          }
        }
      }
      for (let cell in deadEnds) {
        matrix[cell.y][cell.x] = false;
      }
    }
  }*/
  return matrix;
}

let matrix = createMatrix(columns, rows);
matrix = getMazeMatrix(matrix);

drawMaze(matrix);

