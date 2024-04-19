import {Tree, Node} from "./treeDecision.js";
import {parseCSV} from "./parseCSV.js";
let isFileChosen = false;
let isBuilt = false;
let data = [];
let tree = new Tree(new Node());

const clearAll = document.getElementById('clearAll');
const buildTree = document.getElementById('buildTree');
const showResult = document.getElementById('showResult');

inputFileEvent();

function inputFileEvent() {
  let input = document.getElementById("fileInput");
  let inputButton = document.getElementById("chooseFileButton");
  inputButton.addEventListener("click", function () {
    if (isBuilt) {
      alert("Чтобы занаво построить дерево, очистите поле.");
    }
  });
  if (!isBuilt) {
    input.onchange = function () {
      document.getElementById("fileName").textContent = this.files.item(0).name;
      isFileChosen = true;
      textInput(true);

    }
  }
}

function textInput(flag) {
  let textArea = document.getElementById("inputDataset");
  if (flag) {
    textArea.placeholder = "Вы уже выбрали датасет"
    textArea.value = "";
    textArea.disabled = true; //отключает текстовое поле ввода, предотвращая его редактирование.
  } else {
    textArea.placeholder = "Выберите датасет"
    textArea.disabled = false; //включает текстовое поле ввода, разрешая его редактирование.
  }
}

function drawTree(node, treeElement) {
  let li = document.createElement("li");
  let a = document.createElement("a");
  if (node.attribute != null) {
    a.textContent = node.attribute + " -> ";
  }
  a.textContent += node.name;
  li.appendChild(a);
  treeElement.appendChild(li);
  node.htmlElement = a;
  if (node.branches.length === 0) { //если дошли до листьев, то выходим из функции
    return;
  }

  let ul = document.createElement("ul");
  li.appendChild(ul);

  for (let i = node.branches.length - 1; i >= 0; i--) {
    drawTree(node.branches[i], ul); //Рекурсивно вызывает функцию для каждого дочернего узла текущего узла, передавая в неё дочерний узел и элемент списка <ul>
  }
}


buildTree.addEventListener("click", function () {
  if (isBuilt) {
    alert("Сначала нужно очистить поле");
  }
  else {
    document.getElementById("treeDiv").classList.add("border"); //рамка вокруг дерева
    isBuilt = true;
    let textArea = document.getElementById("inputDataset");
    if (isFileChosen) {
      let file = document.getElementById("fileInput").files[0];
      console.log(file);
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function () {
        data = parseCSV(reader.result);
        tree.id3Algorithm(data);
        let treeRoot = document.getElementById("treeStart");
        console.log(treeRoot);
        drawTree(tree.root, treeRoot);
        textArea.placeholder = "Введите путь"
      }
      textInput(false);
    }
    else {
      if (textArea.value === "") {
        isBuilt = false;
        alert("Выберите файл или введите датасет");
      } else {
        data = parseCSV(textArea.value);
        tree.id3Algorithm(data);
        let treeRoot = document.getElementById("treeStart");
        drawTree(tree.root, treeRoot);
        textArea.value = "";
        textArea.placeholder = "Введите путь"
      }
    }
  }
});
clearAll.addEventListener("click", function () {
  document.getElementById("result").textContent = "";
  document.getElementById("treeDiv").classList.remove("border")
  let temp = document.querySelectorAll("a");
  for (let i = 0; i < temp.length; i++) {
    temp[i].classList.remove("path");
  }
  isBuilt = false;
  data = undefined;
  let root = document.getElementById("treeStart");
  while (root.hasChildNodes()) {
    root.removeChild(root.firstChild); //удаляем все дочерние элементы узла
  }
  tree = new Tree(new Node());
  document.getElementById("fileName").textContent = "Файл не выбран";
  isFileChosen = false;

  let textArea = document.getElementById("inputDataset");
  textArea.value = "";
  textInput(false);
});

function getIndexOfElement(elem, array) {
  let index = null;
  for (let i = 0; i < array.length; i++) {
    if (array[i] === elem) {
      index = i;
      break;
    }
  }
  return index;
}
function pathFinder(inputData) {
  let path = [];
  path.push(tree.root);
  while (inputData.length !== 0) {
    let node = path[path.length - 1]; //последний узел в массиве path
    let counter = 0;
    for (let i = 0; i < node.branches.length; i++) {
      let attribute = node.branches[i].attribute;
      let index = getIndexOfElement(attribute, inputData);
      if (index === null) { // текущая ветвь не соответствует никаким входным данным
        counter++;
      }
      else {
        path.push(node.branches[i]); // текущая ветвь соответствует данным, и она добавляется в массив path
        inputData.splice(index, 1); //этот элемент удаляется, чтобы он больше не учитывался при последующих итерациях цикла
        break;
      }
    }
    if (counter === node.branches.length) { //ни одна ветвь не соответствует входным данным
      inputData.splice(0, 1) //первый элемент удаляется, чтобы цикл продолжался без бесконечных итераций.
    }
  }
  return path;
}



function isCorrectData(inputData) {
  let indexOfElement = getIndexOfElement(inputData[0], data[0]);
  if (!(inputData.length === data[0].length - 1 && indexOfElement === null)) {
    return false;
  }
  for (let i = 0; i < inputData.length; i++) { //проверка, что все элементы в inputData существуют в data.
    let counter = 0;
    for (let j = 1; j < data.length; j++) {
      for (let k = 0; k < data[0].length; k++) {
        if (data[j][k] === inputData[i]) {
          counter++;
        }
      }
    }
    if (counter === 0) {
      return false;
    }
  }
  return true;
}

function makeButtonsDisabled(isButtonsOff) {
  let buttons = document.querySelectorAll("button");
  if (isButtonsOff) {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true; //отключаем все кнопки
    }
  }
  else {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = false; //включаем все кнопки
    }
  }
}

async function drawPath(path) {
  let counter = 0;
  makeButtonsDisabled(true); //выключаем кнопки
  while (counter !== path.length) { //пока не дрйдем до конца пути
    let node = path[counter];
    node.htmlElement.classList.add("path"); //выделяем нужную ноду
    counter++;
    await new Promise(resolve => setTimeout(resolve, 500)); //ждем анимацию
    if (counter !== path.length) { //если текущий узел не последний
      node.htmlElement.classList.remove("path"); //удаляем его из пути
    }
  }
  document.getElementById("result").textContent = path[path.length - 1].name; //название последний ноды отображаем в поле result
  makeButtonsDisabled(false); //включаем кнопки
}

showResult.addEventListener("click", async function () {
  if (isBuilt) {
    let temp = document.querySelectorAll("a");
    for (let i = 0; i < temp.length; i++) {
      temp[i].classList.remove("path"); //удаляем старый путь
    }
    document.getElementById("result").textContent = ""; //очищаем поле result
    let textArea = document.getElementById("inputDataset");
    if (textArea.value === "") {
      alert("Введите путь");
    }
    else {
      let inputData = parseCSV(textArea.value);
      inputData = inputData[inputData.length - 1];
      if (isCorrectData(inputData)) {
        let path = pathFinder(inputData); //находим путь в дереве решений
        await drawPath(path); //ждем пока отобразится путь
      }
      else {
        alert("Введите корректный путь. Корректный путь - это одна строка из датасета без последнего значения");
      }
    }
  }
  else {
    alert("Сначала необходимо построить дерево");
  }
});


