const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");

let canvasWidth = window.getComputedStyle(canvas).getPropertyValue("width");
let canvasWidthNum = parseInt(canvasWidth.replace("px", ""));

canvas.width = canvasWidthNum;
canvas.height = canvas.width;

let start = document.getElementById('start');
let finish = document.getElementById('finish');
let erase = document.getElementById('erase');
let wall = document.getElementById('wall');
let begin = document.getElementById('begin');

const paddingJS = 3;
let columns = document.getElementById("sizeM").value;
let rows = columns;
let cellSize = (canvas.width - paddingJS * 2) / columns;

let mazeColor = "#4E4E50";
let startCellColor = "#4D6D9A";
let finishCellColor = "#99C";

let pathCellColor = "#99CED3";
let neighborCellColor = "#5F6366";
let finishPathColor = "#EDB5BF";

let startClicker = false;
let finishClicker = false;
let eraseClicker = false;
let wallClicker = false;
let found = false;

let matrix = createMatrix(columns, rows);

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let startCell = new Cell(null, null);
let finishCell = new Cell(null, null);

class Node {
  constructor(g, parent = Node, position = Cell) {
    this.parent = parent;
    this.position = position;
    this.g = g;
    this.h = Math.abs(finishCell.x - position.x) + Math.abs(finishCell.y - position.y);
    this.f = this.h + this.g;
  }
}

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
  if (startCell.x != null) {
    drawCell(startCell.x, startCell.y, startCellColor);
  }
  if (finishCell.x != null) {
    drawCell(finishCell.x, finishCell.y, finishCellColor);
  }
}

function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

function isValidMove(x, y, matrix) {
  return x >= 0 && x < rows && y >= 0 && y < columns && !matrix[x][y];
}

const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]]

function getMazeMatrix(matrix) {
  let stack = [];

  let startCell = new Cell(0, 0);
  matrix[startCell.x][startCell.y] = true;
  stack.push(startCell);

  while (stack.length > 0) {
    let currentCell = stack.pop();

    let x = currentCell.x;
    let y = currentCell.y;

    let currentDirections = mixArray(directions);

    for (let direction of currentDirections) {
      let [dx, dy] = direction;
      let newCell = new Cell(x + dx * 2, y + dy * 2);

      if (isValidMove(newCell.x, newCell.y, matrix)) {
        matrix[newCell.x][newCell.y] = true;
        matrix[(x + newCell.x) / 2][(y + newCell.y) / 2] = true;

        stack.push(newCell);
      }
    }
  }
  return matrix;
}

function mixArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = getRandomIndex(array);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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

let open = [];
let close = [];

function compare (a, b) {
  return a.f - b.f;
}

function returnPath(finalNode) {
  let parent = finalNode.parent;
  while (parent.parent != null) {
    drawCell(parent.position.x, parent.position.y, finishPathColor);
    parent = parent.parent;
  }
}

function delay(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

function check(neighbor, currentNode) {
  if (neighbor.position.x === finishCell.x && neighbor.position.y === finishCell.y) {
    return;
  }

  if (close.some(node => node.position.x === neighbor.position.x && node.position.y === neighbor.position.y)) {
    return;
  }

  let newG = currentNode.g + 1;

  let isOpen = open.some(node => node.position.x === neighbor.position.x && node.position.y === neighbor.position.y);

  if (!isOpen || newG < neighbor.g) {
    neighbor.g = newG;
    neighbor.parent = currentNode;

    if (!isOpen) {
      open.push(neighbor);
      drawCell(neighbor.position.x, neighbor.position.y, neighborCellColor);
    }
  }
}

async function astar() {
  if (found) {
    return;
  }

  let startNode = new Node(0, null, startCell);

  open.push(startNode);
  while (!found && open.length > 0) {
    open.sort(compare);

    let currentNode = open.shift();

    if (currentNode.position.x === finishCell.x && currentNode.position.y === finishCell.y) {
      found = true;
    }

    let x = currentNode.position.x;
    let y = currentNode.position.y;

    close.push(currentNode);

    if (currentNode.position !== startCell) {
      drawCell(x, y, pathCellColor);
    }

    await delay(20);

    if (y > 0 && matrix[y - 1][x]) {
      let position = new Cell(x, y - 1);
      let neighbor = new Node(currentNode.g + 1, currentNode, position);
      if (neighbor.position.x === finishCell.x && neighbor.position.y === finishCell.y) {
        found = true;
        returnPath(neighbor);
      }
      check(neighbor, currentNode);
    }

    if (y < rows - 1 && matrix[y + 1][x]) {
      let position = new Cell(x, y + 1);
      let neighbor = new Node(currentNode.g + 1, currentNode, position);
      if (neighbor.position.x === finishCell.x && neighbor.position.y === finishCell.y) {
        found = true;
        returnPath(neighbor);
      }
      check(neighbor, currentNode);
    }

    if (x > 0 && matrix[y][x - 1]) {
      let position = new Cell(x - 1, y);
      let neighbor = new Node(currentNode.g + 1, currentNode, position);
      if (neighbor.position.x === finishCell.x && neighbor.position.y === finishCell.y) {
        found = true;
        returnPath(neighbor);
      }
      check(neighbor, currentNode);
    }

    if (x < columns - 1 && matrix[y][x + 1]) {
      let position = new Cell(x + 1, y);
      let neighbor = new Node(currentNode.g + 1, currentNode, position);
      if (neighbor.position.x === finishCell.x && neighbor.position.y === finishCell.y) {
        found = true;
        returnPath(neighbor);
      }
      check(neighbor, currentNode);
    }
  }
  if (!found) {
    alert("Дома не было кровати... 😈")
  }
}

function main() {
  while (!isValidMaze(matrix)) {
    matrix = getMazeMatrix(matrix);
  }
  drawMaze(matrix);
}

function refresh() {
  open = [];
  close = [];

  columns = document.getElementById("sizeM").value;
  rows = columns;
  matrix = createMatrix(columns, rows);
  cellSize = (canvas.width - paddingJS * 2) / columns;

  startCell = new Cell(null, null);
  finishCell = new Cell(null, null);

  startClicker = false;
  finishClicker = false;
  eraseClicker = false;
  wallClicker = false;
  found = false;

  main();
}

document.addEventListener('DOMContentLoaded', function () {
  refresh();
});

document.addEventListener('keydown', function (event) {
  if (event.code === 'Enter') {
    refresh();
  }
});

begin.addEventListener('click', async function () {
  if (startCell.x !== null && finishCell.x !== null) {
    await astar();
  }
  else {
    alert("Лееее, жидкий, а гиде старт и финиш?😢")
  }
});

function clickButton() {
  start.addEventListener('click', function () {
    startClicker = true;
    finishClicker = false;
    eraseClicker = false;
    wallClicker = false;

    canvas.addEventListener('mousedown', function (e) {
      if (startClicker && !finishClicker && !eraseClicker && !wallClicker) {
        if (startCell.x !== null) {
          drawCell(startCell.x, finishCell.y, "white");
          startCell = new Cell(null, null);
        }
        let coordinateX = e.pageX - this.offsetLeft;
        let coordinateY = e.pageY - this.offsetTop;

        let x = Math.trunc(coordinateX / cellSize);
        let y = Math.trunc(coordinateY / cellSize);

        if (matrix[y][x] && (finishCell.x !== x && finishCell.y !== y)) {
          startCell.x = x;
          startCell.y = y;
          drawMaze();
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
        if (finishCell.x !== null) {
          drawCell(finishCell.x, finishCell.y, "white");
          finishCell = new Cell(null, null);
        }
        let coordinateX = e.pageX - this.offsetLeft;
        let coordinateY = e.pageY - this.offsetTop;

        let x = Math.trunc(coordinateX / cellSize);
        let y = Math.trunc(coordinateY / cellSize);

        if (matrix[y][x] && (startCell.x !== x && startCell.y !== y)) {
          finishCell.x = x;
          finishCell.y = y;
          drawMaze();
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
          matrix[y][x] = true;
          drawMaze();
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
          matrix[y][x] = false;
          drawMaze();
        }
      }
    });
  });
}

clickButton();
