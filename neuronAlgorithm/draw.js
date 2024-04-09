const canvas = document.querySelector('canvas');
const clear = document.getElementById('clear');
const ctx = canvas.getContext('2d');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;
canvas.width = 400;
canvas.height = 400;

ctx.strokeStyle = 'white';
ctx.fillStyle = 'black';
ctx.lineWidth = 24;

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

function showPopupMessage(message, duration) {
  // Создаем элемент для сообщения
  var popup = document.createElement('div');
  popup.className = 'popup-message';
  popup.textContent = message;

  // Стилизуем сообщение
  popup.style.position = 'fixed';
  popup.style.top = '50px'; // Расположение сверху
  popup.style.left = '50%'; // Горизонтальное выравнивание
  popup.style.transform = 'translateX(-50%)'; // Центрируем по горизонтали
  popup.style.backgroundColor = '#333';
  popup.style.color = '#fff';
  popup.style.padding = '10px';
  popup.style.borderRadius = '5px';
  popup.style.zIndex = '9999'; // Устанавливаем высокий z-index, чтобы было поверх других элементов

  // Добавляем сообщение на страницу
  document.body.appendChild(popup);

  // Удаляем сообщение через указанное время
  setTimeout(function() {
    document.body.removeChild(popup);
  }, duration);
}

// Пример использования функции


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
  showPopupMessage(sortedIndexes, 30000); 

  console.log(sortedIndexes);
});
