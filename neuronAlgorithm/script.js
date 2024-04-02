
class NeuralNetwork {
    constructor() {
        // this.biases;
        // this.weights;
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

