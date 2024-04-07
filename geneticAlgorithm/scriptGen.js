 class City {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  distanceTo(city) {
    const dx = this.x - city.x;
    const dy = this.y - city.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
};
class Tour {
  constructor(cities) {
    this.cities = cities;
    this.distance = 0;
  }

  getDistance() {<!-- -->
    if (this.distance == 0) {<!-- -->
      for (let i = 0; i <this.cities.length - 1; i++) {<!-- -->
        this.distance += this.cities[i].distanceTo(this.cities[i + 1]);
      }
      this.distance += this.cities[this.cities.length - 1].distanceTo(this.cities[0]);
    }
    return this.distance;
  }
}
function selectParent(population) {<!-- -->
  const fitnessSum = population.reduce((sum, tour) => sum + tour.getDistance(), 0);
  const rouletteWheelPosition = Math.random() * fitnessSum;

  let spinWheel = 0;
  for (let i = 0; i < population.length; i++) {<!-- -->
    spinWheel += population[i].getDistance();
    if (spinWheel >= rouletteWheelPosition) {<!-- -->
      return population[i];
    }
  }
  return population[population.length - 1];
}
function crossover(parent1, parent2) {<!-- -->
  const startPosition = Math.floor(Math.random() * parent1.cities.length);
  const endPosition = Math.floor(Math.random() * parent1.cities.length);

  const childCities = parent1.cities.slice(startPosition, endPosition);

  for (let i = 0; i < parent2.cities.length; i++) {<!-- -->
    if (!childCities.includes(parent2.cities[i])) {<!-- -->
      childCities.push(parent2.cities[i]);
    }
  }

  return new Tour(childCities);
}
function mutate(tour) {
  const mutatePos1 = Math.floor(Math.random() * tour.cities.length);
  const mutatePos2 = Math.floor(Math.random() * tour.cities.length);

  const city1 = tour.cities[mutatePos1];
  const city2 = tour.cities[mutatePos2];

  tour.cities[mutatePos1] = city2;
  tour.cities[mutatePos2] = city1;
}
const POPULATION_SIZE = 300;
const MUTATION_RATE = 0.25;
const GENERATIONS = 500;

function geneticAlgorithm(cities) {
  let population = [];
  for (let i = 0; i < POPULATION_SIZE; i++) {
    const tour = new Tour(cities);
    population.push(tour);
  }

  for (let generation = 0; generation < GENERATIONS; generation++) {
    let newPopulation = [];

    for (let i = 0; i < POPULATION_SIZE; i++) {
      const parent1 = selectParent(population);
      const parent2 = selectParent(population);
      let child = crossover(parent1, parent2);

      if (Math.random() < MUTATION_RATE) {
        mutate(child);
      }

      newPopulation.push(child);
    }

    population = newPopulation;
    const bestTour = getBestTour(population);

    drawTour(bestTour);
  }

  const bestTour = getBestTour(population);
  drawTour(bestTour);
}

function getBestTour(population) {
  return population.sort((a, b) => a.getDistance() - b.getDistance())[0];
}


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


function drawPoint(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y,  r, 0,Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill();
  let city = new City(x, y, r); //point - координаты, поставленной точки
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



function drawTour(tour) {<!-- -->
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'blue';
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
