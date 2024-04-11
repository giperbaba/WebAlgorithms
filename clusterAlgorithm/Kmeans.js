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
const startHierarchyAlgorithm = document.getElementById('startHierarchyAlgorithm');
const startDBSCANAlgorithm = document.getElementById('startDbscanAlgorithm');
const compareAlgorithms = document.getElementById('compareAlgorithms');
let sliderEps = document.getElementById("eps");


let radius = 15;
let circles = [];
let flag = 1;
//let visited = new Set();

function updateEps(value) {
  epsValue.innerText = value;
}
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
    let x = event.offsetX;
    let y = event.offsetY;
    drawPoint(x,y,radius);
  }
  else if (flag === 2) {
    let x = event.offsetX;
    let y = event.offsetY;
    clear(x,y,radius);
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

function shuffleArray(circles) { //выбираем рандомную точку
  for (let i = circles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [circles[i], circles[j]] = [circles[j], circles[i]];
  }
}

function rangeQuery(points, point) { //Находим все точки, которые находятся на eps от нашей выбранной точки
  let eps = sliderEps.value;
  let neighbors = [];
  for (let i = 0; i < points.length; i++) {
    if (point === points[i]) {
      continue;
    }
    let dist = distance(points[i], point);
    if (dist <= eps) {
      neighbors.push(points[i]);
    }

  }
  return neighbors;
}

function expandCluster(cluster, point, neighbors, minCountOfPoints, noise, visited) { //Расширяем наши кластеры точками, которые находятся от нашей точки в радиусе eps и не является шумными
  cluster.push(point);
  visited.push(point);
  for (let i = 0; i < neighbors.length; i++) {
    if (!visited.includes(neighbors[i])) {
      visited.push(neighbors[i]);
      let newNeighbors = rangeQuery(neighbors[i]);
      if (newNeighbors.length >= minCountOfPoints) {
        neighbors.push(...newNeighbors); //объединяем два массива, сохраняя порядок елементов с помощью оператора spread
      }
    }
    if (!noise.includes(neighbors[i]) && !cluster.includes(neighbors[i])) {
      cluster.push(neighbors[i]);
    }
  }
}

function dbscanAlgorithm(circles, minCountOfPoints) {
  let visited = []
  let clusters = [];
  let noise = [];
  for (let i = 0; i < circles.length; i++) {
    if (visited.includes(circles[i])) {
      continue;
    }
    visited.push(circles[i]);
    let neighbors = rangeQuery(circles, circles[i]);
    if (neighbors.length < minCountOfPoints) {
      noise.push(circles[i]);
    }
    else {
      let cluster = [];
      expandCluster(cluster, circles[i], neighbors, minCountOfPoints, noise, visited);
      clusters.push(cluster);

    }
  }
  return [clusters, noise];
}

startDBSCANAlgorithm.addEventListener('click', function () {
  let countOfClusters = document.getElementById("sizeK").value;
  if (circles.length === 0){
    alert("Добавь точки");
  }
  else{
    let [clusters, noise] = dbscanAlgorithm(circles, 5);
    console.log(clusters, noise);
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


compareAlgorithms.addEventListener('click', function () {
  let countOfClusters = document.getElementById("sizeK").value;
  if (circles.length === 0){
    alert("Добавь точки");
  }
  else if(circles.length < countOfClusters) {
    alert("Количество кластеров не может быть больше, чем количество точек");
  }
  else{
    let hierarchyClusters = hierarchy(circles, countOfClusters);
    let kMeansClusters = kMeans(circles, countOfClusters);
    for (let i = 0; i < hierarchyClusters.length; i++) {
      let color = getRandomColor();
      for (let j = 0; j < hierarchyClusters[i].length; j++) {
        let point = hierarchyClusters[i][j];
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0,  Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0,  (1 / 3) * Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
    for (const cluster of kMeansClusters) {
      ctx.fillStyle = cluster.color;
      for (const point of cluster.points) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, (1 / 3) * Math.PI * 2, (2/ 3) * Math.PI * 2);
        ctx.fill();
      }
    }
    let [clusters, noise] = dbscanAlgorithm(circles, 5);
    for (let i = 0; i < clusters.length; i++) {
      let color = getRandomColor();
      for (let j = 0; j < clusters[i].length; j++) {
        let point = clusters[i][j];
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, (2 / 3) * Math.PI * 2, ((2 + 1) / 3) * Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
  }
});
