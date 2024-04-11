// const canvas = document.getElementById('сanvas');
// const ctx = canvas.getContext('2d');
//
// // Функция для центрирования изображения на canvas
// function centerImage(image) {
//   function centerImage(image) {
//     // Получаем высоту и ширину изображения
//     const height = image.length;
//     const width = image[0].length;
//
//     // Вычисляем центр изображения по вертикали и горизонтали
//     const centerY = Math.floor(height / 2);
//     const centerX = Math.floor(width / 2);
//
//     // Устанавливаем начальные координаты изображения
//     let imageY = Math.floor(height / 2);
//     let imageX = Math.floor(width / 2);
//
//     // Вычисляем смещение по вертикали и горизонтали от центра
//     const offsetY = centerY - imageY;
//     const offsetX = centerX - imageX;
//
//     // Создаем новый массив для центрированного изображения
//     const centeredImage = [];
//
//     // Проходим по каждой строке и столбцу изображения
//     for (let y = 0; y < height; y++) {
//       centeredImage[y] = [];
//       for (let x = 0; x < width; x++) {
//         // Проверяем, находится ли текущая позиция в пределах исходного изображения
//         if (y + offsetY < 0 || y + offsetY >= height || x + offsetX < 0 || x + offsetX >= width) {
//           // Если выходим за пределы, устанавливаем значение пикселя как 0
//           centeredImage[y][x] = 0;
//         } else {
//           // Иначе копируем пиксель из исходного изображения в центрированное
//           centeredImage[y][x] = image[y + offsetY][x + offsetX];
//         }
//       }
//     }
//     return centeredImage; // Возвращаем центрированное изображение
//   }
// }
//
// // Обработчик события для кнопки "Центрировать изображение"
// document.getElementById('centerButton').addEventListener('click', function() {
//   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//   const pixels = imageData.data;
//   const image = [];
//
//   // Преобразуем одномерный массив пикселей в двумерный массив
//   for (let y = 0; y < canvas.height; y++) {
//     image[y] = [];
//     for (let x = 0; x < canvas.width; x++) {
//       const index = (y * canvas.width + x) * 4;
//       image[y][x] = pixels.slice(index, index + 4);
//     }
//   }
//
//   const centeredImage = centerImage(image);
//   // Сохраняем центрированное изображение как файл
//   const link = document.createElement('a');
//   link.href = newCanvas.toDataURL();
//   link.download = 'centeredImage.png';
//   link.click();
// });
//
//

