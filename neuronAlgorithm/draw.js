const canvas = document.querySelector('canvas');
const clear = document.getElementById('clear');
const ctx = canvas.getContext('2d');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;
canvas.width = 400;
canvas.height = 400;

ctx.strokeStyle = 'white';
ctx.fillStyle = 'black';
ctx.lineWidth = 26;

// Заполняем канвас пикселями 5x5
for (let x = 0; x < canvas.width; x += 8) {
  for (let y = 0; y < canvas.height; y += 8) {
    ctx.fillRect(x, y, 8, 8);
  }
}

let isDrawing = false;

clear.addEventListener('click', e => {
  if (e.target.id === 'clear') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Заполняем канвас пикселями 5x5
    for (let x = 0; x < canvas.width; x += 8) {
      for (let y = 0; y < canvas.height; y += 8) {
        ctx.fillRect(x, y, 8, 8);
      }
    }
  }
  const elDigits = Array.from(document.querySelectorAll('.digits-field div'));

  elDigits.forEach(function(digit) {
    digit.className = 'digit';
  });

  elDigits.classList.remove('recognized-digit-first');
  elDigits.classList.remove('recognized-digit-second');
  elDigits.classList.remove('recognized-digit-third');
});

function startDrawing(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(Math.floor(e.offsetX / 10) * 10, Math.floor(e.offsetY / 10) * 10);
}

function stopDrawing() {
  isDrawing = false;
}

function drawLine(e) {
  if (!isDrawing) return;
  ctx.lineTo(Math.floor(e.offsetX / 10) * 10, Math.floor(e.offsetY / 10) * 10);
  ctx.stroke();
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', drawLine);

const saveButton = document.getElementById('save');


saveButton.addEventListener('click', () => {
  let csvContent = "data:text/csv;charset=utf-8,";
  let imageMatrix=[];

  for (let y = 0; y < canvas.height; y += 8) {
    for (let x = 0; x < canvas.width; x += 8) {
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      imageMatrix.push([pixelData[2]/255]);
    }
  }
  let rez=net.feedforward(imageMatrix)
  const sortedIndexes = rez.map((value, index) => index)
    .sort((a, b) => rez[b] - rez[a])
    .slice(0, 3);
  const elDigits = Array.from(document.querySelectorAll('.digits-field div'));

  elDigits.forEach(function(digit) {
    digit.className = 'digit';
  });

  elDigits[sortedIndexes[0]].classList.add('recognized-digit-first');
  elDigits[sortedIndexes[1]].classList.add('recognized-digit-second');
  elDigits[sortedIndexes[2]].classList.add('recognized-digit-third');

  console.log(sortedIndexes);
});


