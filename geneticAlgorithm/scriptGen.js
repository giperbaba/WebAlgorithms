class Tour {
  constructor(tour, fitness) {
    this.tour = tour;
    this.fitness = fitness;
  }
}

class City {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const mutationRate = 0.5;
const maximumGenerations = 10000;

let population = [];
let adjacencyMatrix = [];

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getDistance(firstVertex, secondVertex) {
  return Math.sqrt(Math.pow(firstVertex.x - secondVertex.x, 2) + Math.pow(firstVertex.y - secondVertex.y, 2));
}

function getRouteLength(tour) { //длина маршрута через матрицу смежности
  let sm = 0;
  for (let i = 0; i < tour.length - 1; i++) {
    sm += adjacencyMatrix[tour[i]][tour[i + 1]];
  }
  sm += adjacencyMatrix[tour[tour.length - 1]][tour[0]];
  return sm;
}

function shuffle(array) {
  let firstIndex, secondIndex, temporary;
  for (let i = 0; i < array.length; i++) {
    firstIndex = getRandomNumber(0, array.length - 1);
    secondIndex = getRandomNumber(0, array.length - 1);
    temporary = array[firstIndex];
    array[firstIndex] = array[secondIndex];
    array[secondIndex] = temporary;
  }
  return array;
}

function adjMatrixGeneration(size) {
  for (let i = 0; i < size; i++) {
    adjacencyMatrix.push(new Array(size));
  }
  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      let distance = getDistance(cities[i], cities[j]);
      adjacencyMatrix[i][j] = distance;
      adjacencyMatrix[j][i] = distance;
    }
  }
}

function generatePopulation(size) {
  const vertex = [];
  for (let i = 0; i < cities.length; i++) {
    vertex.push(i);
  }
  for (let i = 0; i < size; i++) {
    let temp = shuffle(vertex.slice());
    population.push(new Tour(temp, getRouteLength(temp)));

  }
}

function mutation(child) {
  let i = getRandomNumber(0, cities.length - 1);
  let j = getRandomNumber(0, cities.length - 1);
  while (i < j) {
    const temp = child[i];
    child[i] = child[j];
    child[j] = temp;
    i++;
    j--;
  }
}

function crossover(firstParent, secondParent) {
  let border = getRandomNumber(1, cities.length - 2);
  const firstChild = firstParent.slice(0, border);
  const secondChild = secondParent.slice(0, border);

  for (let i = border; i < firstParent.length; i++) {
    if (!firstChild.includes(secondParent[i])) {
      firstChild.push(secondParent[i]);
    }
    if (!secondChild.includes(firstParent[i])) {
      secondChild.push(firstParent[i]);
    }
  }
  for (let i = border; i < firstParent.length; i++) {
    if (!firstChild.includes(firstParent[i])) {
      firstChild.push(firstParent[i]);
    }
    if (!secondChild.includes(secondParent[i])) {
      secondChild.push(secondParent[i]);
    }
  }

  if (Math.random() >= mutationRate) {
    mutation(firstChild);
  }
  if (Math.random() >= mutationRate) {
    mutation(secondChild);
  }

  population.push(new Tour(firstChild, getRouteLength(firstChild)));
  population.push(new Tour(secondChild, getRouteLength(secondChild)));
}

function getNewGeneration(populationSize) {
  let i = 0;

  while (i < populationSize) {
    let firstParent = getRandomNumber(0, populationSize - 1);
    let secondParent = getRandomNumber(0, populationSize - 1);// выбираем 2 рандомных родителя
    crossover(population[firstParent].tour, population[secondParent].tour);
    i += 2;//кроссовер добавляет 2 потомка к размеру популяции
  }

  population.sort((a, b) => a.fitness - b.fitness);//сортируем массив по приспособленности (в начале более приспособленные)
  population.splice(Math.ceil(population.length / 2));//удаляем половину с меньшей приспособленностью, чтобы размер популяции оставался таким же
}

function startAlgorithm(sizeOfTour) {

  const populationSize = sizeOfTour * sizeOfTour;
  adjacencyMatrix = [];
  population = [];

  adjMatrixGeneration(sizeOfTour);
  generatePopulation(populationSize);

  let countOfGenerations = 0;
  let generationsWithoutChanges = 0;

  const currentMaxTour = population.reduce((max, current) => {
    return (current.fitness > max.fitness) ? current : max;
  });

  drawPointsFromArray(cities)
  drawTour(currentMaxTour.tour, 'deepskyblue');

  let previous = currentMaxTour.fitness

  const intervalId = setInterval(() => {

    if (countOfGenerations === maximumGenerations ||  generationsWithoutChanges === populationSize) {
      clearInterval(intervalId);
      drawTour(population[0].tour, 'deepskyblue');
      return;
    }

    getNewGeneration(populationSize);

    if (previous !== population[0].fitness) {
      previous = population[0].fitness;
      drawPointsFromArray(cities)
      drawTour(population[0].tour, 'deepskyblue');

      generationsWithoutChanges = 0
    }

    generationsWithoutChanges++;
    countOfGenerations++;
  }, 0);
}


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 400;

let radius = 10;
let cities = [];
let flag = 1;

function clearAllFunction() {
  flag = 0;
  cities = [];
  ctx.beginPath();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = neonColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
clearAll.addEventListener("click", function() {
  clearAllFunction();
});

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
const neonColor = getComputedStyle(document.documentElement).getPropertyValue('--clr-bg');

// Устанавливаем цвет заливки контекста рисования
ctx.fillStyle = neonColor;
ctx.fill();

const getPath = document.getElementById('getPath'); // Замените 'buildPathButton' на id вашей кнопки

getPath.addEventListener('click', function() {
  startAlgorithm(cities.length);
});


function drawPoint(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0,Math.PI * 2);
  ctx.fillStyle = 'pink';
  ctx.fill();
  let city = new City(x, y); //point - координаты, поставленной точки
  cities.push(city); //обновляем массив с точками после каждой новой нарисованной точки
}
function clear(x, y){
  for (let i = 0; i < cities.length; i++) { //проходимся по нарисованным точкам
    let dist = Math.sqrt((x - cities[i].x) ** 2 + (y - cities[i].y) ** 2); // вычисляем расстояние между точками
    if (dist <= radius) { //если расстояние меньше, чем радиус, то есть мышка заходит на окружность
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width, canvas.height); //очищаем канву от ненужной точки в белый
      ctx.fillStyle = neonColor;
      ctx.fill();
      cities.splice(i, 1); //начиная с индекса i удаляем один элемент
      for (let j = 0; j < cities.length; j++) { //проходимся по оставшимся точкам, для того чтобы не удалять нужные точки
        ctx.beginPath();
        ctx.arc(cities[j].x, cities[j].y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'pink'; //красим неудаленные точки в черный
        ctx.fill();
      }
      break;
    }
  }
}

function drawTour(route, color) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(cities[route[0]].x, cities[route[0]].y);
  for (let i = 1; i < route.length; i++) {
    ctx.lineTo(cities[route[i]].x, cities[route[i]].y);
  }
  ctx.lineTo(cities[route[0]].x, cities[route[0]].y);
  ctx.stroke();
}
function drawPointsFromArray(pointsArray) {
  // Очищаем канвас
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Рисуем точки из массива
  pointsArray.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0,Math.PI * 2);
    ctx.fillStyle = 'pink';
    ctx.fill();
  });
}
