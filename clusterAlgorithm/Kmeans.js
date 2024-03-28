const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let canvasWidth = window.getComputedStyle(canvas).getPropertyValue("width");
let canvasWidthNum = parseInt(canvasWidth.replace("px", ""));
canvas.width = canvasWidthNum;
canvas.height = canvas.width;

const add = document.getElementById('add');
const deletePoint = document.getElementById('delete');
const deleteAll = document.getElementById('deleteAll');
const startKMeansAlgorithm = document.getElementById('startKMeansAlgorithm');
const startHierarchyAlgorithm = document.getElementById('startHierarchyAlgorithm')

let radius = 15;
let circles = [];
let flag = 1;

add.addEventListener('click', function () {
  flag = 1;
});

deletePoint.addEventListener('click', function () {
  flag = 2;
});
deleteAll.addEventListener('click', function () {
  flag = 0;
  circles = [];
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height); //всю канву красим в белый
  ctx.fillStyle = "white";
  ctx.fill();
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

startKMeansAlgorithm.addEventListener('click', function () {
  let countOfClusters = document.getElementById("sizeK").value;
  if (circles.length === 0){
    alert("Добавь точки");
  }
  else if(circles.length < countOfClusters) {
    alert("Количество кластеров не может быть больше, чем количество точек");
  }
  else{
    let clusters = kMeans(circles,countOfClusters);
    for (const cluster of clusters) {
      ctx.fillStyle = cluster.color;
      for (const point of cluster.points) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
});

ctx.beginPath();
ctx.rect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "white";
ctx.fill();
class Point {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
}
function drawPoint(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y,  r, 0,Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill();
  let point = new Point(x, y, r); //point - координаты, поставленной точки
  circles.push(point); //обновляем массив с точками после каждой новой нарисованной точки
}

function clear(x, y, r){
  for (let i = 0; i < circles.length; i++) { //проходимся по нарисованным точкам
    let dist = Math.sqrt((x - circles[i].x) ** 2 + (y - circles[i].y) ** 2); // вычисляем расстояние между точками
    if (dist <= circles[i].r) { //если расстояние меньше, чем радиус, то есть мышка заходит на окружность
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width, canvas.height); //очищаем канву от ненужной точки в белый
      ctx.fillStyle = 'white';
      ctx.fill();
      circles.splice(i, 1); //начиная с индекса i удаляем один элемент
      for (let j = 0; j < circles.length; j++) { //проходимся по оставшимся точкам, для того чтобы не удалять нужные точки
        ctx.beginPath();
        ctx.arc(circles[j].x, circles[j].y, circles[j].r, 0, 2 * Math.PI);
        ctx.fillStyle = 'black'; //красим неудаленные точки в черный
        ctx.fill();
      }
      break;
    }
  }
}

function getRandomColor() {
  let color = '#';
  let randomColor = Math.floor(Math.random()*16777215).toString(16)
  color += randomColor;
  return color;
}
function distance(firstPoint, secondPoint) {
  return Math.sqrt(Math.pow(Math.max(firstPoint.x, secondPoint.x) - Math.min(firstPoint.x, secondPoint.x), 2) + Math.pow(Math.max(firstPoint.y, secondPoint.y) - Math.min(firstPoint.y, secondPoint.y), 2));
}
function nearestCentroid(point, centroids) {
  let minDistance = Infinity;
  let nearest = null;
  for (const centroid of centroids) {
    const dist = distance(point, centroid);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = centroid;
    }
  }
  return nearest;
}

function getRandomCentroids(countOfClusters) { //вычисляем координаты рандомных центроидов
  let centroids = [];
  for (let i = 0; i < countOfClusters; i++) {
    let x = Math.floor(Math.random() * canvas.width); //Math.random() генерирует число от 0 до 1
    let y = Math.floor(Math.random() * canvas.height);
    centroids.push({x, y});
  }
  return centroids;
}

function updateCentroids(clusters) {
  const newCentroids = [];
  for (const cluster of clusters) {
    let sumOfX = 0;
    let sumOfY = 0;
    for (const point of cluster.points) {
      sumOfX += point.x; //для каждой точки вычисляем координаты х и у и добавляем в переменные
      sumOfY += point.y;
    }
    let centroidX = sumOfX / cluster.points.length;  //вычисляем координаты новых центроидов для каждого кластера
    let centroidY = sumOfY / cluster.points.length;
    newCentroids.push({x: centroidX, y: centroidY});
  }
  return newCentroids;
}

function kMeans(points, countOfClusters) {
  let centroids = getRandomCentroids(countOfClusters); //берем рандомные координаты центроидов
  let clusters = [];
  for (let i = 0; i < countOfClusters; i++) {
    const color = getRandomColor(); //берем рандомный цвет
    clusters.push({centroid: centroids[i], points: [], color: color}); //в массив кластеров добавляем сведения о уентроиде, поставленных точках и цвете
  }
  let signal = true;
  while (signal) {
    for (const point of points) { //берем каждую точку из поставленных
      const nearestCenter = nearestCentroid(point, centroids); //высчитываем для нее координаты близжайшего центроида

      for (const cluster of clusters) { //для каждого кластера
        if (cluster.centroid === nearestCenter) { //проверяем, если центроид кластера равен близжайшему центроиду, то
          cluster.points.push(point); //добавляем в кластер новую точку
          signal = false;
        }
      }
    }
    let newCentroids = updateCentroids(clusters); //обновляем центроиды
    if (centroids.toString() === newCentroids.toString()) { //если центроиды идентичны, то прерываем цикл
      signal = false;
    }
    centroids = newCentroids; //если центроиды разные, то обновляем центроиды
  }
  return clusters; //возвращаем получившиеся кластеры
}

startHierarchyAlgorithm.addEventListener('click', function () {
  let countOfClusters = document.getElementById("sizeK").value;
  if (circles.length === 0){
    alert("Добавь точки");
  }
  else if(circles.length < countOfClusters) {
    alert("Количество кластеров не может быть больше, чем количество точек");
  }
  else{
    let clusters = hierarchy(circles, countOfClusters);
    for (let i = 0; i < clusters.length; i++) {
      let color = getRandomColor();
      for (let j = 0; j < clusters[i].length; j++) {
        let point = clusters[i][j];
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
  }
});

function countDist(firstCluster, secondCluster) {
  let minDist = Infinity;
  for (let i = 0; i < firstCluster.length; i++) {
    for (let j = 0; j < secondCluster.length; j++) {
      let dist = distance(firstCluster[i], secondCluster[j]);
      if (dist < minDist) {
        minDist = dist;
      }
    }
  }
  return minDist;
}

function indexOfClusters(clusters) {
  let minDist = Infinity;
  let row, column;
  for (let i = 0; i < clusters.length; i++) {
    for (let j = i + 1; j < clusters.length; j++) {
      let dist = countDist(clusters[i], clusters[j]);
      if (dist < minDist) {
        minDist = dist;
        row = i;
        column = j;
      }
    }
  }
  return [row, column];
}
function hierarchy(points, countOfClusters) {

  let clusters = [];
  for (let i = 0; i < points.length; i++) {
    clusters.push([points[i]]);
  }
  while (clusters.length > countOfClusters) {
    let [row, column] = indexOfClusters(clusters);
    let newCluster = clusters[row].concat(clusters[column]);
    clusters.splice(column, 1);
    clusters.splice(row, 1);
    clusters.push(newCluster)
  }

  return clusters;
}
