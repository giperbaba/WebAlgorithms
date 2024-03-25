// import {mnistData} from "./mnistData.js"

class NeuralNetwork {
    constructor(sizes) {
        this.numLayers = sizes.length;
        this.sizes = sizes;
        this.biases = sizes.slice(1).map(size => Array.from({ length: size }, () => Math.random())); // Инициализация смещений случайными значениями
        this.weights = sizes.slice(1).map((size, i) => Array.from({ length: size }, () => Array.from({ length: sizes[i] }, () =>Math.random() * (0.5 + 0.5) - 0.5))); // Инициализация весов случайными значениями
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


// Пример использования:
const sizes = [785, 16,16, 10]; // Нейронная сеть с 2 входами, 3 нейронами в скрытом слое и 1 нейроном на выходе
const net = new NeuralNetwork(sizes);

console.log(net.weights)

