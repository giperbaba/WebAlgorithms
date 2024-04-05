import { parseCSV } from "./parseCSV.js";
let id = 0;
let targetCount;
let classesSet;
class Node {
  constructor(attributeName, data, parent, depth) {
    this.attributeName = attributeName; //атрибут по которому произошло разбиение
    this.data = data;
    this.parent = parent;
    this.depth = depth + 1;
    this.child = [];

    if (this.depth >= 10) {
      this.isLeaf = true;
      this.class = this.getMostCommonClass("attributeSet");
      return;
    }
    if (this.checkClassEqual()) {
      this.isLeaf = false;

    }
  }

  getClasses(data) {
    let classes = [];
    data.getClassData().forEach((item) => {
      if (!classes.includes(item)) classes.push(item);
    })
    return classes;
  }

  getClassCount(data, className) {
    let count = 0;
    data.getClassData().forEach((item) => {
      if (item === className) {
        count++;
      }
    })
  }

  getMostCommonClass(data) {
    let classes = this.getClasses(data);
    let classCount = [];
    let max = 0;
    let maxIndex = 0;
    classes.forEach((item) => {
      classCount.push(this.getClassCount(data, item));
      if (classCount[classCount.length - 1] > max) {
        max = classCount[classCount.length - 1];
        maxIndex = classCount.length - 1;
      }
    });
    return classes[maxIndex];
  }

  checkClassEqual() {
    let attributes = this.attributeName;
    for (let i = 0; i < attributes.length; i++) {
      if (attributes[i][targetCount] != attributes[i + 1][targetCount]) {
        return true;
      }
    }
    return false;
  }

  selectAttribute() {
    let attributes = this.attributeName;
    let minEntropy = Infinity;
    let attributeIndex = 0;
    let keyValue = 0;
}

function entropyInfo(attributes) {
  let result = 0;
  for (let curClass of classesSet) {
    let attributesCurClass = attributes.filter(str => str[targetCount] == curClass).length;
    if (attributesCurClass) {
      result -= (attributesCurClass / attributes.length) * Math.log2(attributesCurClass / attributes.length);
    }
  }
  return result;
}

function entropyInfoForEachAttribute(targetValues, target, attributes) {
  let result = 0;
  for (let value of targetValues) {
    let curValue = attributes.filter(str => str[target] == value);
    result += curValue.length / attributes.length * entropyInfo(curValue);
  }
  return result;
}

function informationGain(targetValues, target, attributes) {
  return entropyInfo(attributes) - entropyInfoForEachAttribute(targetValues, target, attributes);
}

function splitInfo(targetValues, target, attributes) {
  let result = 0;
  for (let value of targetValues) {
    let curValue = attributes.filter(str => str[targetCount] == value);
    result -= curValue.length / attributes.length * Math.log2(curValue.length / attributes.length);
  }
  return result;
}

function gainRatio(targetValues, target, attributes) {
  let gain = informationGain(targetValues, target, attributes);
  let split = splitInfo(targetValues, target, attributes);
  return [target, gain / split];
}





