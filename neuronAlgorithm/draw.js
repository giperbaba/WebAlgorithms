const canvas = document.querySelector('canvas');
const clear = document.getElementById('clear');
const ctx = canvas.getContext('2d');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;
canvas.width = 500;
canvas.height = 500;

ctx.strokeStyle = 'white';
ctx.fillStyle = 'black';
ctx.lineWidth = 10;
ctx.fillRect(0, 0, canvas.width, canvas.height);


let isDrawing = false;


clear.addEventListener('click', e => {
  if (e.target.id === 'clear') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
});

function startDrawing(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

// Функция, завершающая рисование
function stopDrawing() {
  isDrawing = false;
}

// Функция, рисующая линию
function drawLine(e) {
  if (!isDrawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

// Добавляем обработчики событий
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', drawLine);
