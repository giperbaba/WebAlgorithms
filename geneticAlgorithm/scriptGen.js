
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

let radius = 10;
let cities = [];
let flag = 1;

clearAll.addEventListener("click", function() {
  clearAllFunction();
});

function clearAllFunction() {
  flag = 0;
  cities = [];
  ctx.beginPath();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

add.addEventListener('click', function () {
  flag = 1;
});

deletePoint.addEventListener('click', function () {
  flag = 2;
});
canvas.addEventListener('click', function(event) {
  if (flag === 1) {
    let x = event.clientX - canvas.offsetLeft; // получаем координату X курсора относительно левого края элемента canvas.
    let y = event.clientY - canvas.offsetTop; //мы получаем координату Y курсора относительно верхнего края элемента canvas.
    drawPoint(x,y,radius);
  }
  else if (flag === 2) {
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    clear(x,y,radius);
  }
});

ctx.beginPath();
ctx.rect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "white";
ctx.fill();

const getPath = document.getElementById('getPath'); // Замените 'buildPathButton' на id вашей кнопки

getPath.addEventListener('click', function() {
  // Вызываем функцию geneticAlgorithm(cities) при нажатии на кнопку
  geneticAlgorithm(cities);
});


function drawPoint(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0,Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill();
  let city = new City(x, y); //point - координаты, поставленной точки
  cities.push(city); //обновляем массив с точками после каждой новой нарисованной точки
}
function clear(x, y, r){
  for (let i = 0; i < cities.length; i++) { //проходимся по нарисованным точкам
    let dist = Math.sqrt((x - cities[i].x) ** 2 + (y - cities[i].y) ** 2); // вычисляем расстояние между точками
    if (dist <= cities[i].r) { //если расстояние меньше, чем радиус, то есть мышка заходит на окружность
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width, canvas.height); //очищаем канву от ненужной точки в белый
      ctx.fillStyle = 'white';
      ctx.fill();
      cities.splice(i, 1); //начиная с индекса i удаляем один элемент
      for (let j = 0; j < cities.length; j++) { //проходимся по оставшимся точкам, для того чтобы не удалять нужные точки
        ctx.beginPath();
        ctx.arc(cities[j].x, cities[j].y, cities[j].r, 0, 2 * Math.PI);
        ctx.fillStyle = 'black'; //красим неудаленные точки в черный
        ctx.fill();
      }
      break;
    }
  }
}



function drawTour(tour, color) {<!-- -->
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  for (let i = 0; i < tour.cities.length - 1; i++) {<!-- -->
    ctx.beginPath();
    ctx.moveTo(tour.cities[i].x, tour.cities[i].y);
    ctx.lineTo(tour.cities[i + 1].x, tour.cities[i + 1].y);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(tour.cities[tour.cities.length - 1].x, tour.cities[tour.cities.length - 1].y);
  ctx.lineTo(tour.cities[0].x, tour.cities[0].y);
  ctx.stroke();
}
