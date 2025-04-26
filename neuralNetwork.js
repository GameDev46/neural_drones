/*

 _____                         ______                 ___   ____ 
|  __ \                        |  _  \               /   | / ___|
| |  \/  __ _  _ __ ___    ___ | | | |  ___ __   __ / /| |/ /___ 
| | __  / _` || '_ ` _ \  / _ \| | | | / _ \\ \ / // /_| || ___ \
| |_\ \| (_| || | | | | ||  __/| |/ / |  __/ \ V / \___  || \_/ |
 \____/ \__,_||_| |_| |_| \___||___/   \___|  \_/      |_/\_____/


*/

/* 
	AUTHOR: GameDev46

	Youtube: https://www.youtube.com/@gamedev46
	Github: https://github.com/GameDev46
*/

class NeuralNetwork {
	layers = [];
	weights = [];
	biases = [];
	neuralLayers = [];
	activationFunction = [];
	decimalPlaces = 5;

	constructor(options) {
		let inputs = options.inputs;
		let layers = options.layers;
		let outputs = options.outputs;

		this.neuralLayers = layers;

		this.decimalPlaces = options.decimalPlaces || 5;
		
		this.layers = new Array(layers.length + 2).fill(0);
		this.biases = new Array(layers.length + 1).fill(0);

		this.layers[0] = new Array(inputs).fill(0);

		for (let i = 0; i < layers.length; i++) {
			this.layers[i + 1] = new Array(layers[i]).fill(0);
		}

		this.layers[this.layers.length - 1] = new Array(outputs).fill(0);

		this.activationFunction = new Array(layers.length + 2).fill(this.relU);

		this.setupWeights();
		this.setupBiases();
	}

	predict(data) {

		let count = Math.min(data.length, this.layers[0].length);

		for (let i = 0; i < count; i++) {
			this.layers[0][i] = this.round(data[i]);
		}

		this.calculateOutputs();

		return this.layers[this.layers.length - 1];
	}

	getOutput() {
		return this.layers[this.layers.length - 1];
	}

	setupWeights() {

		// Weight is read where first level is layer, second level is node and third level is previous nodes

		let weights = [];

		// Setup layer weights
		for (let x = 1; x < this.layers.length; x++) {

			let weightsToAdd = [];

			for (let y = 0; y < this.layers[x].length; y++) {

				let nodeWeightData = [];

				for (let i = 0; i < this.layers[x - 1].length; i++) {

					nodeWeightData.push(this.round((Math.random() * 2) - 1));

				}

				weightsToAdd.push(nodeWeightData);

			}

			weights.push(weightsToAdd);

		}

		this.weights = weights;

	}

	setupBiases() {

		this.biases = [];

		for (let x = 1; x < this.layers.length; x++) {

			let biasData = [];

			for (let y = 0; y < this.layers[x].length; y++) {
				biasData.push(this.round((Math.random() * 2) - 1));
			}

			this.biases.push(biasData)
		}

	}

	calculateOutputs() {

		for (let x = 1; x < this.layers.length; x++) {

			for (let y = 0; y < this.layers[x].length; y++) {

				let data = this.layers[x - 1];

				this.layers[x][y] = 0;

				for (let i = 0; i < data.length; i++) {
					this.layers[x][y] += this.round(data[i] * this.weights[x - 1][y][i]);
				}

				// Activation function

				this.layers[x][y] = this.round(this.activationFunction[x - 1](this.layers[x][y] + this.biases[x - 1][y]));

			}
		}

	}

	setActivationFunction(types) {

		for (let i = 0; i < Math.min(types.length, this.activationFunction.length); i++) {

			this.activationFunction[i] = types[i];

		}

	}

	relU(num) {
		return Math.max(0, num);
	}

	sigmoid(num) {
		return 1 / (1 + Math.exp(-num))
	}

	hyperbolicTangent(num) {
		return Math.tanh(num);
	}

	round(num) {
		let multi = 10 ^ this.decimalPlaces;
		
		return Math.round(num * multi) / multi;
	}

	merge(mergeNeuron) {

		for (let x = 0; x < Math.min(mergeNeuron.weights.length, this.weights.length); x++) {

			for (let y = 0; y < Math.min(mergeNeuron.weights[x].length, this.weights[x].length); y++) {

				for (let i = 0; i < Math.min(mergeNeuron.weights[x][y].length, this.weights[x][y].length); i++) {

					// Merge weights
					let opts = [this.weights[x][y][i], mergeNeuron.weights[x][y][i]];
					this.weights[x][y][i] = (opts[0] + opts[1]) / 2;

				}

			}

		}

		for (let x = 0; x < Math.min(mergeNeuron.biases.length, this.biases.length); x++) {

			for (let y = 0; y < Math.min(mergeNeuron.biases[x].length, this.biases[x].length); y++) {
				let opts = [this.biases[x][y], mergeNeuron.biases[x][y]]
				this.biases[x][y] = (opts[0] + opts[1]) / 2;
			}

		}

	}

	mutate(mutationChance, mutationIntensity) {

		for (let x = 0; x < this.weights.length; x++) {

			for (let y = 0; y < this.weights[x].length; y++) {

				for (let i = 0; i < this.weights[x][y].length; i++) {

					if (Math.random() * 100 < mutationChance) {
						// Mutate weight
						this.weights[x][y][i] += (Math.random() * mutationIntensity * 2) - mutationIntensity;

					}

				}

			}

		}
	}

	copy(mergeNeuron) {

		for (let x = 0; x < Math.min(mergeNeuron.weights.length, this.weights.length); x++) {

			for (let y = 0; y < Math.min(mergeNeuron.weights[x].length, this.weights[x].length); y++) {

				for (let i = 0; i < Math.min(mergeNeuron.weights[x][y].length, this.weights[x][y].length); i++) {

					// Replace weights
					this.weights[x][y][i] = mergeNeuron.weights[x][y][i];

				}

			}

		}

		for (let x = 0; x < Math.min(mergeNeuron.biases.length, this.biases.length); x++) {

			for (let y = 0; y < Math.min(mergeNeuron.biases[x].length, this.biases[x].length); y++) {
				
				this.biases[x][y] = mergeNeuron.biases[x][y];
				
			}

		}

	}

	getDNA() {

		let networkDNA = {};

		networkDNA.weights = this.weights;
		networkDNA.biases = this.biases;

		networkDNA.inputs = this.layers[0].length;
		networkDNA.layers = this.neuralLayers;
		networkDNA.outputs = this.layers[this.layers.length - 1].length;

		networkDNA.decimalPlaces = this.decimalPlaces;
		networkDNA.activationFunction = this.activationFunction;

		return networkDNA;
	}

}

export { NeuralNetwork };
