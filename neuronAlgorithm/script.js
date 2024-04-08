async function fetchDataFromCSV(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Ошибка загрузки файла');
    }
    const csvText = await response.text();
    const csvArray = csvText.split('\n').map(line => line.split(','));
    return csvArray;
  } catch (error) {
    console.error('Ошибка:', error);
    return null;
  }
}
class NeuralNetwork {
    constructor() {
        this.biases1=fetchDataFromCSV('https://raw.githubusercontent.com/giperbaba/WebAlgorithms/neuroAlgorithm/neuronAlgorithm/biases1.csv');
        this.biases2=fetchDataFromCSV('https://raw.githubusercontent.com/giperbaba/WebAlgorithms/neuroAlgorithm/neuronAlgorithm/biases2.csv');
        this.weights1=fetchDataFromCSV('https://raw.githubusercontent.com/giperbaba/WebAlgorithms/neuroAlgorithm/neuronAlgorithm/weight1.csv');
        this.weights2=fetchDataFromCSV('https://raw.githubusercontent.com/giperbaba/WebAlgorithms/neuroAlgorithm/neuronAlgorithm/weight2.csv');
        console.log(this.biases1);
      //импортирование весов из файла после обучения
    }

  sigmoid(x)
  {
    return 1 / (1 + Math.exp(-x));
  }

  dotProduct(v1, v2) {
    let result = 0;
    for (let i = 0; i < v1.length; i++) {
      result += v1[i] * v2[i];
    }
    return result;
  }

  feedforward(a) {
    // Return the output of the network if "a" is input.
    for (let i = 0; i < this.biases.length; i++) {
      let b = this.biases[i];
      let w = this.weights[i];
      a = sigmoid(dotProduct(w, a) + b);
    }
    return a;
  }

}

const net = new NeuralNetwork();

