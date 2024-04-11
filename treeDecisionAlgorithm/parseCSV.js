function parseCSV(stringCSV) {
  let stringArray = [];
  let regex = /("([^"]|"")*"|([^"(,|;)\n]*))?([(,|;)\n])?/;
  let size = 0;
  let flag = 0;
  while (regex.test) {
    let tempArray = regex.exec(stringCSV);
    if (tempArray[0] === "") {
      break;
    }
    let currentString = tempArray[1]
    if (tempArray[1][0] === '"') {
      currentString = "";
      for (let i = 1; i < tempArray[1].length - 1; i++) {
        currentString += tempArray[1][i];
      }
    }
    stringArray[stringArray.length] = currentString
    if ((!flag) && (tempArray[4] === '\n')) {
      flag = true;
      size++;
    }
    else {
      if (!flag) {
        size++;
      }
    }
    stringCSV = stringCSV.replace(regex, "")
  }
  stringArray[stringArray] = size;

  let string = stringArray;
  let stringSize = string[string.length - 1];
  let counter = 0;
  let row = 0;
  let stringData = [];

  for (let i = 0; i < ((string.length - 1) / stringSize); i++) {
    stringData[i] = [];
  }
  for (let i = 0; i < string.length; i++) {
    if (counter < stringSize) {
      stringData[row][counter] = string[i];
      counter++;
    }
    else {
      counter = 0;
      row++;
      i--;
    }
  }
  return stringData
}
