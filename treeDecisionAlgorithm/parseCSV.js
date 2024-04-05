export function parseCSV(string) {
  string = string.replace(/\r/g, "");
  return string.split("\n").map(function (line) { //создаем новый массив line
    if (line.length > 0) {
      return line.split(",").filter(function (item) { //если длина больще 0, то создаем новый массив
        return item.length > 0;
      });
    }
  }).filter(function (item) {
    return item !== undefined;
  });
}

