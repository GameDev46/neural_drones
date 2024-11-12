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

	replit: https://replit.com/@GameDev46
	youtube: https://www.youtube.com/@gamedev46
	twitter: https://twitter.com/GameDev46
	github: https://github.com/GameDev46
*/

import { NeuralNetwork } from "./neuralNetwork.js";
import { platformer } from "./platformer.js";
import { networkLoader } from "./presets.js";

const canvas = document.getElementById("canvas");

// Load presets

let savedNetworkPresets = {};
let nextSaveSlot = 0;

let linePositions = networkLoader.loadNetworks();
console.log(linePositions)

function updatePresetDisplay() {

	document.getElementById("presets").innerHTML = '<option value="" selected>Presets</option>';

	savedNetworkPresets = {};

	let i = 0;
	let hasFoundEnd = false;
	
	while (!hasFoundEnd) {
		
		let localData = localStorage.getItem(i.toString());

		if (i == linePositions[0]) {
			document.getElementById("presets").innerHTML = document.getElementById("presets").innerHTML + '<optgroup label="Default Networks">';
		}

		if (i == linePositions[1]) {
			document.getElementById("presets").innerHTML = document.getElementById("presets").innerHTML + '</optgroup>';
			document.getElementById("presets").innerHTML = document.getElementById("presets").innerHTML + '<optgroup label="Your Networks">';
		}
	
		if (localData == null) {
			nextSaveSlot = i;

			hasFoundEnd = true;	

			document.getElementById("presets").innerHTML = document.getElementById("presets").innerHTML + '</optgroup>';
		}
		else {
	
			localData = JSON.parse(localData);
			savedNetworkPresets[i.toString()] = localData;
		
			let opt = document.createElement("option");
			opt.value = i.toString();
			opt.innerText = localData.name || ("Unnamed " + i.toString());
			document.getElementById("presets").appendChild(opt);
			
		}

		i++;
		
	}
	
}

updatePresetDisplay();

// Neuron setup

const population = 300;

const generationTime = 10;
let currentGeneration = 1;

let targetEnabled = true;
let particlesEnabled = true;

let neurons = [];

let presets = {
	inputs: 6,
	layers: [10, 15, 8],
	outputs: 2,
	decimalPlaces: 5
}

for (let i = 0; i < population; i++) {
	neurons.push(new NeuralNetwork(presets));

	neurons[i].setActivationFunction([neurons[i].sigmoid, neurons[i].sigmoid, neurons[i].relU, neurons[i].sigmoid]);

}

// Setup platforming physics

platformer.setup(canvas, {
	friction: 1.5,
	gravity: 9.81
});

platformer.colour(platformer.rgba(255, 255, 255, 0.1));

platformer.createPlatform(0, 0, 20, 10000, true);
platformer.createPlatform(canvas.width - 20, 0, 20, 10000, true);
platformer.createPlatform(0, 0, 10000, 20, true);
platformer.createPlatform(0, canvas.height - 20, 10000, 20, true);

//platformer.createPlatform((canvas.width / 2) - 50, 70, 110, 20);

let target = {
	x: canvas.width / 2,
	y: canvas.height / 2
}

let startPosition = {
	x: 50,
	y: canvas.height / 2
}

platformer.colour(platformer.rgb(200, 100, 100));

let targetObj = platformer.createPlatform(target.x - 5, target.y - 5, 10, 10, false);

let characters = [];

for (let i = 0; i < population; i++) {

	characters.push(new platformer.character(canvas, platformer.platforms));

	characters[i].scale.set(10, 10);
	characters[i].position.set(startPosition.x, startPosition.y);
	characters[i].friction = platformer.friction;
	characters[i].gravity = platformer.gravity;

	characters[i].fitness = 0;
	characters[i].timeAtClosest = 0;
	characters[i].collisionTime = 0;
	characters[i].airTime = 0;
	characters[i].bestAirTime = 0;
	characters[i].lastParticleTime = 0;

	characters[i].colour(platformer.rgba(255, 255, 255, 1));

}

// Next generation function

function nextGeneration() {

	let fitnessData = [];
	let totalFitness = 0;

	let fitnessBasedCloning = [];

	for (let i = 0; i < population; i++) {

		fitnessData.push(calculateFitness(characters[i]));
		totalFitness += fitnessData[i];

		characters[i].fitness = fitnessData[i];

		fitnessBasedCloning.push([i, totalFitness]);

	}

	let averageFitness = totalFitness / population;
	console.log(averageFitness);

	let nextGenerationArray = [];

	for (let i = 0; i < population; i++) {

		if (fitnessData[i] < averageFitness * 0.7 || true) {

			// Mutate selected parent

			let parent = 0;

			let randomParent = Math.round(Math.random() * totalFitness);

			// Randomly pick network based on how well they did

			for (let x = 0; x < fitnessBasedCloning.length; x++) {
				if (fitnessBasedCloning[x][1] >= randomParent) {
					parent = fitnessBasedCloning[x][0];
					x += fitnessBasedCloning.length;
				}
			}

			let child = new NeuralNetwork(presets);
			child.setActivationFunction([child.sigmoid, child.sigmoid, child.relU, child.sigmoid]);

			child.copy(neurons[parent]);
			child.mutate(2, 0.1);

			nextGenerationArray[i] = child;

		}
		else {
			nextGenerationArray[i] = neurons[i];
		}

	}

	neurons = nextGenerationArray;

	resetCharacters();

	// Update generation counter

	currentGeneration += 1;
	document.getElementById("generationCounter").innerText = "Generation " + currentGeneration;

}

// Fitness function

function calculateFitness(person) {

	let timeAtClosest = person.timeAtClosest;
	timeAtClosest *= timeAtClosest;

	let totalContactTime = person.collisionTime;
	totalContactTime *= totalContactTime;

	let airTime = person.bestAirTime;
	airTime *= airTime;

	let fit = 0;
	fit -= totalContactTime;
	fit += timeAtClosest;
	fit += airTime;

	return Math.max(1, fit);
}

function resetCharacters() {

	for (let i = 0; i < population; i++) {

		characters[i].position.set(startPosition.x, startPosition.y);
		characters[i].velocity.set(0, 0);
		characters[i].direction = 0;
		characters[i].crashes = 0;
		characters[i].fitness = 0;
		characters[i].timeAtClosest = 0;
		characters[i].collisionTime = 0;
		characters[i].airTime = 0;
		characters[i].bestAirTime = 0;
		characters[i].lastParticleTime = 0;

	}

}

function distanceSqr(pos1, pos2) {
	let xDif = pos2.x - pos1.x;
	let yDif = pos2.y - pos1.y;

	return (xDif * xDif) + (yDif * yDif);
}

function length(xDif, yDif) {
	return Math.sqrt((xDif * xDif) + (yDif * yDif))
}

function findBest() {

	let largestFitness = 0;
	let fitnessPosition = 0;

	for (let i = 0; i < population; i++) {

		if (characters[i].fitness > largestFitness) {

			largestFitness = characters[i].fitness;
			fitnessPosition = i;

		}

	}

	return fitnessPosition;

}

function createParticle(person, engineForce) {

	if (person.lastParticleTime + timeBetweenParticles < timer) {

		// Right thruster smoke
		addParticle(person.position.x + (Math.cos(person.direction) * 13), person.position.y + (Math.sin(person.direction) * 13), person.direction, person.velocity.x, person.velocity.y, engineForce, "smoke");

		// Left thruster smoke
		addParticle(person.position.x - (Math.cos(person.direction) * 13), person.position.y - (Math.sin(person.direction) * 13), person.direction, person.velocity.x, person.velocity.y, engineForce, "smoke");


		// Right thruster fire
		addParticle(person.position.x + (Math.cos(person.direction) * 13), person.position.y + (Math.sin(person.direction) * 13), person.direction, person.velocity.x, person.velocity.y, engineForce, "fire");

		// Left thruster fire
		addParticle(person.position.x - (Math.cos(person.direction) * 13), person.position.y - (Math.sin(person.direction) * 13), person.direction, person.velocity.x, person.velocity.y, engineForce, "fire");

		return true;

	}

	return false;

}

let particles = [];

function addParticle(xPosition, yPosition, direction, xVelocity, yVelocity, engineForce, type) {

	if (engineForce < 0.05) {
		// No thrust so no particles
		return;
	}

	particles.push({
		x: xPosition,
		y: yPosition,
		xDirection: Math.sin(direction),
		yDirection: -Math.cos(direction),
		xVelocity: xVelocity,
		yVelocity: yVelocity,
		size: 5,
		colour: {
			r: 252,
			g: 155,
			b: 81,
			a: 1
		},
		timeAlive: 0,
		lifeTime: 0.1,
		growth: -1
	})

	if (type == "smoke") {

		particles[particles.length - 1].colour = {
			r: 200,
			g: 200,
			b: 200,
			a: 0.3
		}

		particles[particles.length - 1].size = 13;
		particles[particles.length - 1].lifeTime = 0.3;
		particles[particles.length - 1].growth = 1;

	}

}

function updateParticles(delta) {

	for (let i = 0; i < particles.length; i++) {

		particles[i].timeAlive += delta;

		if (particles[i].timeAlive >= particles[i].lifeTime) {
			// Remove particle
			particles.splice(i, 1);
			i -= 1;
			continue;
		}

		particles[i].x += particles[i].xDirection * 0.5 * delta;
		particles[i].y += particles[i].yDirection * 0.5 * delta;

		particles[i].y += 100 * delta;

		let multi = 1 - (particles[i].timeAlive / particles[i].lifeTime);

		let alpha = multi * particles[i].colour.a;

		if (particles[i].growth > 0) multi = (particles[i].timeAlive / particles[i].lifeTime);

		let particleMaxSize = particles[i].size;
		particleMaxSize = multi * particleMaxSize;

		// Draw particle

		platformer.ctx.fillStyle = platformer.rgba(particles[i].colour.r, particles[i].colour.g, particles[i].colour.b, alpha);

		platformer.ctx.beginPath();
		platformer.ctx.arc(particles[i].x, particles[i].y, particleMaxSize, 0, 2 * Math.PI);
		platformer.ctx.fill();

	}

}

// Update loop

let showBest = false;
let bestNetwork = 0;

let backgroundColour = platformer.rgb(13, 13, 43);

let nextGen = generationTime;
let lastdate = Date.now();

let timeBetweenParticles = 0.05;

let frameIterations = 1;

let timer = 0;

function gameLoop() {

	let delta = (Date.now() - lastdate) / 1000;
	lastdate = Date.now();

	platformer.drawPlatforms(backgroundColour);

	bestNetwork = findBest();

	for (let step = 0; step < frameIterations; step++) {

		updateParticles(delta);

		timer += delta;

		for (let i = 0; i < population; i++) {
			// Attach neural network

			let targetDistance = {
				x: Math.max(0, Math.min(1, (target.x - characters[i].position.x) * 0.1)),
				y: Math.max(0, Math.min(1, (target.y - characters[i].position.y) * 0.1))
			}

			let currentDist = length(target.x - characters[i].position.x, target.y - characters[i].position.y);

			if (currentDist < 50 && targetEnabled) {
				characters[i].timeAtClosest += 50 / Math.max(10, currentDist);
			}

			if (characters[i].isColliding) {
				characters[i].collisionTime += 1;
				characters[i].airTime = 0;
			}
			else {
				characters[i].airTime += 1;
				characters[i].bestAirTime = Math.max(characters[i].bestAirTime, characters[i].airTime);
			}

			// Run the data through the neural networks
			let out = neurons[i].predict([targetDistance.x, targetDistance.y, characters[i].velocity.x, characters[i].velocity.y, Math.sin(characters[i].direction), Math.cos(characters[i].direction)]);

			characters[i].applyVelocity(out[0] * 1000 * delta);
			characters[i].direction += ((out[1] * 1) - 0.5) * delta;

			// Check if only the best should be shown and display particles if enabled

			characters[i].colour(platformer.rgb(200, 200, 230));

			if (showBest) {
				if (bestNetwork != i) {
					characters[i].colour(platformer.rgba(255, 255, 255, 0));
				}
				else {

					if (particlesEnabled) {
						if (createParticle(characters[i], out[0])) characters[i].lastParticleTime = timer;
					}

				}
			}
			else {

				if (particlesEnabled) {
					if (createParticle(characters[i], out[0])) characters[i].lastParticleTime = timer;
				}

			}

			characters[i].update(delta);
		}

		if (timer > nextGen) {
			nextGen = timer + generationTime;
			nextGeneration();
		}

	}

	requestAnimationFrame(gameLoop);
}

gameLoop()

window.addEventListener("resize", e => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
})

// Toggle menu

let menuOpen = true;

document.getElementById("toggleMenu").addEventListener("click", e => {

	menuOpen = !menuOpen;

	if (menuOpen) {
		document.getElementById("menu").style.display = "flex";
	}
	else {
		document.getElementById("menu").style.display = "none";
	}

});

// Toggle best view

document.getElementById("toggleBest").addEventListener("click", e => {

	showBest = !showBest;

})

document.getElementById("startX").value = startPosition.x;
document.getElementById("startY").value = startPosition.y;

document.getElementById("startX").addEventListener("change", e => {

	startPosition.x = Number(document.getElementById("startX").value);

});

document.getElementById("startY").addEventListener("change", e => {

	startPosition.y = Number(document.getElementById("startY").value);

});

document.getElementById("targetX").value = target.x;
document.getElementById("targetY").value = target.y;

document.getElementById("targetX").addEventListener("change", e => {

	target.x = Number(document.getElementById("targetX").value);

	platformer.platforms[targetObj].x = target.x;

});

document.getElementById("targetY").addEventListener("change", e => {

	target.y = Number(document.getElementById("targetY").value);

	platformer.platforms[targetObj].y = target.y;

});

document.getElementById("frameIterations").addEventListener("change", e => {

	frameIterations = Number(document.getElementById("frameIterations").value);

});

document.getElementById("targetEnabled").addEventListener("click", e => {

	targetEnabled = document.getElementById("targetEnabled").checked;

	platformer.platforms[targetObj].colour = platformer.rgba(200, 100, 100, targetEnabled * 1);

})

document.getElementById("particlesEnabled").addEventListener("click", e => {

	particlesEnabled = document.getElementById("particlesEnabled").checked;

})

// Save and load a network

document.getElementById("presets").addEventListener("change", e => {

	if (document.getElementById("presets").value == "") {
		resetWorld();
		return;
	}

	let index = Number(document.getElementById("presets").value);

	loadNetwork(savedNetworkPresets[index])
	
})

document.getElementById("save").addEventListener("click", e => {

	let neuronDNA = neurons[bestNetwork].getDNA();

	neuronDNA.generation = currentGeneration;

	neuronDNA.startX = startPosition.x;
	neuronDNA.startY = startPosition.y;

	neuronDNA.targetEnabled = targetEnabled;
	neuronDNA.targetX = target.x;
	neuronDNA.targetY = target.y;

	neuronDNA.name = prompt("Save Name:");

	neuronDNA = JSON.stringify(neuronDNA);

	copyToClipboard(neuronDNA);

	localStorage.setItem(nextSaveSlot.toString(), neuronDNA);
	nextSaveSlot += 1;

	updatePresetDisplay();

});

document.getElementById("load").addEventListener("click", e => {

	navigator.clipboard.readText()
		.then(text => {

			loadNetwork(JSON.parse(text));
			
			localStorage.setItem(nextSaveSlot.toString(), text);
			nextSaveSlot += 1;

			updatePresetDisplay();

		})
		.catch(err => {

			alert('Failed to read clipboard contents: ' + err);

		});

});

function loadNetwork(loadedNetwork) {

	timer = nextGen + generationTime;
	currentGeneration = loadedNetwork.generation;

	presets = {
		inputs: loadedNetwork.inputs,
		layers: loadedNetwork.layers,
		outputs: loadedNetwork.outputs,
		decimalPlaces: loadedNetwork.decimalPlaces
	}

	startPosition.x = loadedNetwork.startX;
	startPosition.y = loadedNetwork.startY;

	document.getElementById("startX").value = startPosition.x;
	document.getElementById("startY").value = startPosition.y;

	target.x = loadedNetwork.targetX;
	target.y = loadedNetwork.targetY;

	targetEnabled = loadedNetwork.targetEnabled;

	document.getElementById("targetX").value = target.x;
	document.getElementById("targetY").value = target.y;

	platformer.platforms[targetObj].x = target.x;
	platformer.platforms[targetObj].y = target.y;

	document.getElementById("targetEnabled").checked = targetEnabled;
	platformer.platforms[targetObj].colour = platformer.rgba(200, 100, 100, targetEnabled * 1);

	for (let i = 0; i < population; i++) {

		let network = new NeuralNetwork(presets);

		//network.setActivationFunction(loadedNetwork.activationFunction);
		network.setActivationFunction([network.sigmoid, network.sigmoid, network.relU, network.sigmoid]);

		network.weights = loadedNetwork.weights;
		network.biases = loadedNetwork.biases;

		neurons[i] = network;

		characters[i].position.set(startPosition.x, startPosition.y);
		characters[i].velocity.set(0, 0);
		characters[i].direction = 0;
		characters[i].crashes = 0;
		characters[i].fitness = 0;
		characters[i].timeAtClosest = 0;
		characters[i].collisionTime = 0;
		characters[i].airTime = 0;
		characters[i].bestAirTime = 0;
		characters[i].currentTarget = 0;
		characters[i].targetTimer = 0;
		characters[i].lastParticleTime = 0;

	}
}

function copyToClipboard(str) {

	if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
		return navigator.clipboard.writeText(str);
	}

	return Promise.reject('The Clipboard API is not available.');

}

// Reset simulation on click

document.getElementById("reset").addEventListener("click", e => {

	resetWorld();

})

function resetWorld() {
	
	timer = nextGen + generationTime;

	currentGeneration = 0;
	document.getElementById("generationCounter").innerText = "Generation " + currentGeneration;

	resetCharacters();

	for (let i = 0; i < population; i++) {
		neurons[i] = new NeuralNetwork(presets);

		neurons[i].setActivationFunction([neurons[i].sigmoid, neurons[i].sigmoid, neurons[i].relU, neurons[i].sigmoid]);

	}
	
}
