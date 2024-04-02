// const canvas = document.querySelector('canvas');
// const clear = document.getElementById('clear');
// const ctx = canvas.getContext('2d');
//
// const canvasOffsetX = canvas.offsetLeft;
// const canvasOffsetY = canvas.offsetTop;
// canvas.width = 400;
// canvas.height = 400;
//
// ctx.strokeStyle = 'white';
// ctx.fillStyle = 'black';
// ctx.lineWidth = 15;
//
// // Заполняем канвас пикселями 5x5
// for (let x = 0; x < canvas.width; x += 5) {
//   for (let y = 0; y < canvas.height; y += 5) {
//     ctx.fillRect(x, y, 5, 5);
//   }
// }
//
// let isDrawing = false;
//
// clear.addEventListener('click', e => {
//   if (e.target.id === 'clear') {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//     // Заполняем канвас пикселями 5x5
//     for (let x = 0; x < canvas.width; x += 5) {
//       for (let y = 0; y < canvas.height; y += 5) {
//         ctx.fillRect(x, y, 5, 5);
//       }
//     }
//   }
// });
//
// function startDrawing(e) {
//   isDrawing = true;
//   ctx.beginPath();
//   ctx.moveTo(Math.floor(e.offsetX / 10) * 10, Math.floor(e.offsetY / 10) * 10);
// }
//
// function stopDrawing() {
//   isDrawing = false;
// }
//
// function drawLine(e) {
//   if (!isDrawing) return;
//   ctx.lineTo(Math.floor(e.offsetX / 10) * 10, Math.floor(e.offsetY / 10) * 10);
//   ctx.stroke();
// }
//
// canvas.addEventListener('mousedown', startDrawing);
// canvas.addEventListener('mouseup', stopDrawing);
// canvas.addEventListener('mousemove', drawLine);
//
// const saveButton = document.getElementById('save');
//
// saveButton.addEventListener('click', () => {
//   const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
//   const link = document.createElement('a');
//   link.href = image;
//   link.download = 'my_drawing.png';
//   link.click();
// });
const canvas = document.querySelector('canvas');
const clear = document.getElementById('clear');
const ctx = canvas.getContext('2d');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;
canvas.width = 400;
canvas.height = 400;

ctx.strokeStyle = 'white';
ctx.fillStyle = 'black';
ctx.lineWidth = 16;

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


saveButton.addEventListener('click', () => {
  let csvContent = "data:text/csv;charset=utf-8,";
  const imageMatrix=[];

  for (let y = 0; y < canvas.height; y += 16) {
    for (let x = 0; x < canvas.width; x += 16) {
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      console.log(pixelData);
      const color = [pixelData[2]];
      csvContent += color + ",";
    }
    csvContent += "\n";
  }

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.href = encodedUri;
  link.download = 'pixel_colors.csv';
  link.click();
});
