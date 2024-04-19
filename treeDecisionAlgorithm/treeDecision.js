export class Node {
  constructor() {
    this.htmlElement = null;
    this.attribute = null;
    this.depth = 0;
    this.branches = [];
    this.parent = null;
    this.name = null;
    this.data = null;
  }

  setParent(parent) {
    this.parent = parent;
  }
  addBranch(branch) {
    this.branches.push(branch);
  }
  setName(name) {
    this.name = name;
  }
}
export class Tree {
  constructor(root) {
    this.root = root;
    this.nodes = [root];
  }

  getKeyIndex(attributeName, dataMatrix) { //получаем идекс атрибуута из заголовка
    let index = 0;
    for (let i = 0; i < dataMatrix[0].length; i++) {
      if (dataMatrix[0][i] === attributeName) {
        index = i;
        break;
      }
    }
    return index;
  }

  getUniqueNames(attributeName, dataMatrix) {
    let index = this.getKeyIndex(attributeName, dataMatrix);
    let uniqueNames = [];
    for (let i = 1; i < dataMatrix.length; i++) {
      let string = dataMatrix[i][index];
      let counter = 0;
      for (let j = 0; j < uniqueNames.length; j++) {
        if (uniqueNames[j] === string) {
          counter++;
        }
      }
      if (counter === 0) {
        uniqueNames.push(string);
      }
    }
    return uniqueNames;
  }

  getClassCount(attributeName, attributeValue, dataMatrix) {
    let flag = false;
    let index = this.getKeyIndex(attributeName, dataMatrix); //получаем индекс столбца в матрице данных, соответствующий указанному имени атрибута.
    if (attributeValue === null) {
      flag = true;
    }
    let uniqueClassNames = this.getUniqueNames(dataMatrix[0][dataMatrix[0].length - 1], dataMatrix); //уникальные имена классов (последний столбец в матрице данных)
    let counterUniqueNames = new Array(uniqueClassNames.length);
    for (let i = 0; i < counterUniqueNames.length; i++) {
      counterUniqueNames[i] = 0;
    }
    for (let i = 1; i < dataMatrix.length; i++) { //заголовок не считаем
      for (let j = 0; j < uniqueClassNames.length; j++) {
        if (flag) {
          if (uniqueClassNames[j] === dataMatrix[i][dataMatrix[0].length - 1]) {
            counterUniqueNames[j]++;
          }
        } else {
          if (uniqueClassNames[j] === dataMatrix[i][dataMatrix[0].length - 1] && attributeValue === dataMatrix[i][index]) {
            counterUniqueNames[j]++;
          }
        }
      }
    }
    return counterUniqueNames; //возвращаем сколько уникальных названий из первого столбца соответствует выбранному аттрибуту
  }

  sumOfClassCount(attributeName, attributeValue, dataMatrix) {
    let tempArray = this.getClassCount(attributeName, attributeValue, dataMatrix); //массив, содержащий количество объектов для каждого класса по заданому атрибуту
    let sum = 0;
    for (let i = 0; i < tempArray.length; i++) {
      sum += tempArray[i];
    }
    return sum; //общее количество объектов для всех классов, удовлетворяющих заданным атрибутам и их значениям.

  }

  getProportions(array, index) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i]; //прибавляем количество каждого класса
    }
    return array[index] / sum; //количество уникальных классов делим на всё
  }
  getEntropyInfo(attributeName, attributeValue, dataMatrix) {

    let countArray = this.getClassCount(attributeName, attributeValue, dataMatrix); // массив, содержащий количество объектов для каждого класса
    for (let i = 0; i < countArray.length; i++) {
      if (countArray[i] === 0) { //Если какой-либо класс не имеет объектов, то энтропия для данного атрибута будет равна 0
        return 0;
      }
    }
    let result = 0;
    for (let i = 0; i < countArray.length; i++) {
      let proportion = this.getProportions(countArray, i);
      result -= proportion * Math.log2(proportion);
    }
    return result;
  }

  getInformationGain(attributeName, dataMatrix) {
    let gain = this.getEntropyInfo(attributeName, null, dataMatrix); //значение энтропии для всей выборки без учета какого-либо конкретного значения атрибута
    let names = this.getUniqueNames(attributeName, dataMatrix); //уникальные имена каждого класса
    let objectQuantity = this.sumOfClassCount(attributeName, null, dataMatrix);  //общее количестов объектов

    for (let i = 0; i < names.length; i++) {
      let curEntropy = this.getEntropyInfo(attributeName, names[i], dataMatrix);
      let curQuantity = this.sumOfClassCount(attributeName, names[i], dataMatrix);
      gain -= Math.abs(curQuantity / objectQuantity) * curEntropy;
    }
    return gain;
  }

  getMaxGain(dataMatrix) {
    let maxKey;
    let maxGain = 0;
    for (let i = 0; i < dataMatrix[0].length - 1; i++) {
      let gain = this.getInformationGain(dataMatrix[0][i], dataMatrix);
      if (gain > maxGain) {
        maxGain = gain
        maxKey = dataMatrix[0][i];
      }
    }
    return maxKey;
  }

  splitData(attributeName, attributeValue, dataMatrix) {
    let index = this.getKeyIndex(attributeName, dataMatrix); //индекс столбца в матрице данных, соответствующий указанному имени атрибута
    let updateData = [];
    updateData[0] = []; //новая матрица
    for (let i = 0; i < dataMatrix[0].length; i++) {
      updateData[0][i] = dataMatrix[0][i]; //заголовок копируется
    }
    for (let i = 1; i < dataMatrix.length; i++) {
      if (attributeValue === dataMatrix[i][index]) {
        updateData[updateData.length] = []; //создается новая строка
        for (let j = 0; j < dataMatrix[0].length; j++) {
          updateData[updateData.length - 1].push(dataMatrix[i][j]);
        }
      }
    }
    return updateData;
  }

  splitForOne(path, dataMatrix) {
    let currentMatrix = [];
    currentMatrix[0] = []
    console.log(path)
    for (let i = path.length - 1; i >= 0; i -= 2) {
      let key = path[i]; //атрибут
      for (let j = 0; j < dataMatrix[0].length; j++) {
        if (dataMatrix[0][j] === key) {
          currentMatrix[0].push(key); //добавляем в заголовок имя атрибута
        }
        if (i - 2 < 0 && j === dataMatrix[0].length - 1) { //если это последний атрибут в пути, то добавляется последний столбец из в заголовок.
          currentMatrix[0].push(dataMatrix[0][dataMatrix[0].length - 1]);
        }
      }
    }
    for (let i = 1; i < dataMatrix.length; i++) {
      currentMatrix[i] = []; //создаем пустые строки
    }
    for (let j = 0; j < currentMatrix[0].length; j++) { //все столбцы
      for (let k = 1; k < dataMatrix.length; k++) { //все строки
        for (let l = 0; l < dataMatrix[0].length; l++) {
          if (dataMatrix[0][l] === currentMatrix[0][j]) { //затем для каждой строки dataMatrix ищется соответствующее значение и добавляется в currentMatrix
            currentMatrix[k].push(dataMatrix[k][l]);
          }
        }
      }
    }
    for (let i = path.length - 1; i >= 0; i -= 2) {
      let key = path[i];
      let object = path[i - 1]; //i - 1  индекс объекта, на котором выполняется фильтрация.
      for (let j = 0; j < currentMatrix[0].length - 1; j++) { //столбцы
        let counter = 0;
        if (currentMatrix[0][j] === key) { //совпадает ли текущий столбец атрибутов с текущим атрибутом из пути
          for (let k = 1; k < currentMatrix.length; k++) { //строки
            if (currentMatrix[k][j] !== object) { //Если значение не соответствует указанному объекту
              counter++;
            }
          }
          let secondCounter = 0;
          while (secondCounter !== counter) {
            for (let k = 1; k < currentMatrix.length; k++) {
              if (currentMatrix[k][j] !== object) {
                currentMatrix.splice(k, 1); //удаляем строки, которые не соответсвуют объекту
                secondCounter++;
              }
            }
          }
        }

      }

    }
    return currentMatrix;
  }

  id3Algorithm(dataMatrix) {
    let rootName = this.getMaxGain(dataMatrix); //выбираем атрибут с наибольшим приростом информации в качестве корня дерева решений
    this.root.setName(rootName); //устанавливаем имя корнего узла
    this.root.data = dataMatrix; //устанавливаем набор данных для крневого узла
    let stack = [];

    stack.push(this.root); //корневой узел помещаем в стек
    while (stack.length !== 0) { //пока стек не опустеет
      let uniqueNames = this.getUniqueNames(stack[0].name, stack[0].data); //уникальные значения атрибута текущего узла
      for (let i = 0; i < uniqueNames.length; i++) {
        let splitMatrix = this.splitData(stack[0].name, uniqueNames[i], stack[0].data); //разделение данных по выбранному атрибуту
        let node = new Node(); //новый узел
        node.attribute = uniqueNames[i];
        node.data = splitMatrix;
        node.setParent(stack[0]);
        node.depth = node.parent.depth + 1;
        this.nodes.push(node);
        let entropyOfVariant = this.getEntropyInfo(stack[0].name, uniqueNames[i], stack[0].data); //вычсляем энтропию для текущего значения атрибута
        if (entropyOfVariant === 0 || node.data[0].length === 1) {
          if (entropyOfVariant === 0) {
            let namesLast = this.getUniqueNames(dataMatrix[0][dataMatrix[0].length - 1], node.data);
            node.setName(namesLast[0]); //устанавливаем имя класса для узла
          }
          else {
            let currentNode = node;
            let path = [];
            while (currentNode.parent != null) {
              path.push(currentNode.attribute);
              path.push(currentNode.parent.name);
              currentNode = currentNode.parent;
            }
            let matrix = this.splitForOne(path, node.data); //делим дальше
            let namesLast = this.getUniqueNames(dataMatrix[0][dataMatrix[0].length - 1], matrix);
            node.setName(namesLast[0]);
          }
        } else {
          node.setName(this.getMaxGain(node.data)); //Если энтропия не равна нулю, то устанавливается имя атрибута с наибольшим приростом информации для узла
          stack.push(node); //узел добавляем в стек для дальнейшего исследования его потомков
        }
        stack[0].addBranch(node); //добавляем созданный узел в качестве потомка текущего узла
      }
      stack.splice(0, 1); //удаляем текущий узел из стека
    }

    return this.root; //возвращаем корневой узел
  }
}
