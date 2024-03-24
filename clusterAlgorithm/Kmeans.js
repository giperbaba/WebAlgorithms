const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let canvasWidth = window.getComputedStyle(canvas).getPropertyValue("width");
let canvasWidthNum = parseInt(canvasWidth.replace("px", ""));
canvas.width = canvasWidthNum;
canvas.height = canvas.width;

class Point {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
}

ctx.beginPath();
ctx.rect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "white";
ctx.fill();

function drawPoint(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y,  r, 0,Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill();
  let point = new Point(x, y, r);
  circles.push(point);
}

function clear(x, y, r){
  for (let i = 0; i < circles.length; i++) {
    const dist = Math.sqrt((x - circles[i].x) ** 2 + (y - circles[i].y) ** 2);
    if (dist <= circles[i].r) {
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.fill();
      circles.splice(i, 1);
      for (let j = 0; j < circles.length; j++) {
        ctx.beginPath();
        ctx.arc(circles[j].x, circles[j].y, circles[j].r, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
      }
      break;
    }
  }
}


let radius = 15;
let circles = [];
let action = 1;
const add = document.getElementById('add');
const erase = document.getElementById('delete');
const deleteAll = document.getElementById('deleteAll');
const startK = document.getElementById('startK');

function getRandomColor() {
  let color = '#';
  const randomColor = Math.floor(Math.random()*16777215).toString(16)
  color += randomColor;
  return color;
}
add.addEventListener('click', function () {
  action = 1;
});

erase.addEventListener('click', function () {
  action = 2;
});
deleteAll.addEventListener('click', function () {
  action = 0;
  circles = [];
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fill();
});

canvas.addEventListener('click', function(event) {
  if (action === 1) {
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    drawPoint(x,y,radius);
  }
  else if (action === 2) {
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    clear(x,y,radius);
  }
});

startK.addEventListener('click', function () {
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

function distance(firstPoint, secondPoint) {
  return Math.sqrt(Math.pow(firstPoint.x - secondPoint.x, 2) + Math.pow(firstPoint.y - secondPoint.y, 2));
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

function getRandomCentroids(countOfClasters) {
  const centroids = [];
  const canvas = document.querySelector("canvas");
  const width = canvas.width;
  const height = canvas.height;
  for (let i = 0; i < countOfClasters; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
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
      sumOfX += point.x;
      sumOfY += point.y;
    }
    const centroidX = sumOfX / cluster.points.length;
    const centroidY = sumOfY / cluster.points.length;
    newCentroids.push({x: centroidX, y: centroidY});
  }
  return newCentroids;
}

function kMeans(points, countOfClusters) {
  let centroids = getRandomCentroids(countOfClusters);
  let clusters = [];
  for (let i = 0; i < countOfClusters; i++) {
    const color = getRandomColor();
    clusters.push({centroid: centroids[i], points: [], color: color});
  }
  while (true) {
    for (const cluster of clusters) {
      cluster.points = [];
    }
    for (const point of points) {
      const nearestPoint = nearestCentroid(point, centroids);
      for (const cluster of clusters) {
        if (cluster.centroid === nearestPoint) {
          cluster.points.push(point);
          break;
        }
      }
    }
    const newCentroids = updateCentroids(clusters);
    if (centroids.toString() === newCentroids.toString()) {
      break;
    }
    centroids = newCentroids;
  }
  return clusters;
}
