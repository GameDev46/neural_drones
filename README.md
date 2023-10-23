# neural_drones

300 neural networks hooked up to simple 2D drones try to learn to stay in the air and reach the red target over multiple generations

## How does it work?

Neural drones makes use of a very simple neural network library that I built, which is located in the [neuralNetwork.js file in the main branch](/neuralNetwork.js), that uses a simple genetic algorithm to select the best drones of each generation and let them clone and mutate themselves each generation which results in the drones adapting better to the task at hand. In this project the "fitness" (how good a neural network is) of the drone is calculated by using the time they spent against a wall or the ground, the amount of collision they have had with the ground and the average distance that they were from the target (if left on). These are then used to calculate a fitness score in the calculateFitness() function (line 214) in the [script.js file](/script.js), where they are then compared to all the other fitness scores of the group. This process is then repeated every 10 seconds as a new generation is introduced.

## Saving and Loading

You can save and load the networks using the save and load button located on the settings panel, by default the networks are saved to the localstorage of your browser, but this not only has a cap on the amount of data that can be stored but also is reset if your search history is cleared so I would reccomend using thr save button instead. When you press the save button a JSON object s copied to your clipboard which you can then paste into notepad or another text editing software before then saving that to your device.

To load a saved neural network simply copy the contents of the save file you created to your clipboard before then hittin load, the program will then read the copied JSON object from your clipboard and load the neural netowrks with the saved settings and will even restore the generation count that they were saved on.

## Website

You can try out neural drones [here on its website](https://gamedev46.github.io/neural_drones/), or you can fork the repository and download and run it on your own device!
