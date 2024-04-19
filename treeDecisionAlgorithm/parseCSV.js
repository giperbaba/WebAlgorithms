export function parseCSV(stringCSV) {
  let stringArray = [];
  let regex = /("([^"]|"")*"|([^"(,|;)\n]*))?([(,|;)\n])?/ //регулярка для одного атрибута
  let size = 0;
  let flag = 0;
  while (regex.test) { //выполняется до тех пор, пока тест регулярного выражения проходит
    let tempArray = regex.exec(stringCSV); //каждую строку подхлдящую под регулярку записываем в массив

    if (tempArray[0] === "") { //Проверяем, если временный массив пуст, значит достигнут конец строки CSV
      break;
    }
    let currentString = tempArray[1]; //берем одну строку без запятых
    stringArray[stringArray.length] = currentString; //в массив кладем каждое значение
    if ((!flag) && (tempArray[4] === '\n')) { //если строка закончилоась
      console.log(tempArray[0], tempArray[1], tempArray[2], tempArray[3], tempArray[4])
      flag = true;
      size++;
    }
    else { //если строка еще продолжается
      if (!flag) {
        size++;
      }
    }
    stringCSV = stringCSV.replace(regex, ""); //удаляем обработанные данные
  }
  stringArray[stringArray.length] = size; //в конец массива записываем размер каждой строчки

  let stringSize = stringArray[stringArray.length - 1];
  let counter = 0;
  let row = 0;
  let stringData = [];

  for (let i = 0; i < ((stringArray.length - 1) / stringSize); i++) { //цикл для итерации по строкам CSV файла
    stringData[i] = []; //создаем матрицу
  }
  for (let i = 0; i < stringArray.length - 1; i++) {
    if (counter < stringSize) {
      stringData[row][counter] = stringArray[i]; //в матрицу записываем каждое слово
      counter++;
    }
    else { //если строка закончилась
      counter = 0;
      row++;
      i--;
    }
  }
  return stringData; //возвращаем матрицу слов
}
