<a href="https://github.com/GameDev46" title="Go to profile">
    <img src="https://img.shields.io/static/v1?label=GameDev46&message=Profile&color=Green&logo=github&style=for-the-badge&labelColor=1f1f22" alt="GameDev46 - image_classifier">
    <img src="https://img.shields.io/badge/Version-1.3.5-green?style=for-the-badge&labelColor=1f1f22&color=Green" alt="GameDev46 - image_classifier">
</a>


![Static Badge](https://img.shields.io/badge/-HTML5-1f1f22?style=for-the-badge&logo=HTML5)
![Static Badge](https://img.shields.io/badge/-CSS-1f1f22?style=for-the-badge&logo=CSS3&logoColor=6060ef)
![Static Badge](https://img.shields.io/badge/-JavaScript-1f1f22?style=for-the-badge&logo=JavaScript)
    
<a href="https://github.com/GameDev46/neural_drones/stargazers">
    <img src="https://img.shields.io/github/stars/GameDev46/neural_drones?style=for-the-badge&labelColor=1f1f22" alt="stars - neural_drones">
</a>

<a href="https://github.com/GameDev46/neural_drones/forks">
    <img src="https://img.shields.io/github/forks/GameDev46/neural_drones?style=for-the-badge&labelColor=1f1f22" alt="forks - image_drones">
</a>

<a href="https://github.com/GameDev46/neural_drones/issues">
    <img src="https://img.shields.io/github/issues/GameDev46/neural_drones?style=for-the-badge&labelColor=1f1f22&color=blue"/>
 </a>

<br>
<br>

<a href="https://github.com/GameDev46/neural_drones/releases/">
    <img src="https://img.shields.io/github/tag/GameDev46/neural_drones?include_prereleases=&sort=semver&color=Green&style=for-the-badge&labelColor=1f1f22" alt="GitHub tag">
</a>

<a href="https://github.com/GameDev46/neural_drones/issues">
    <img src="https://img.shields.io/github/issues/GameDev46/neural_drones?style=for-the-badge&labelColor=1f1f22" alt="issues - neural_drones">
</a>

<br>
<br>

<div align="left">
<a href="https://gamedev46.github.io/neural_drones/">
    <img src="https://img.shields.io/badge/View_site-GH_Pages-2ea44f?style=for-the-badge&labelColor=1f1f22" alt="View site - GH Pages">
</a>
</div>

<br>

<p align="left">
<a href="https://twitter.com/gamedev46" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/twitter.svg" alt="gamedev46" height="30" width="40" /></a>
<a href="https://instagram.com/oliver_pearce47" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/instagram.svg" alt="oliver_pearce47" height="30" width="40" /></a>
<a href="https://www.youtube.com/c/gamedev46" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/youtube.svg" alt="gamedev46" height="30" width="40" /></a>
</p>

# neural_drones

300 neural networks hooked up to simple 2D drones try to learn to stay in the air and reach the red target over multiple generations

## How does it work?

Neural drones makes use of a very simple neural network library that I built, which is located in the [neuralNetwork.js file in the main branch](/neuralNetwork.js), that uses a simple genetic algorithm to select the best drones of each generation and let them clone and mutate themselves each generation which results in the drones adapting better to the task at hand. In this project the "fitness" (how good a neural network is) of the drone is calculated by using the time they spent against a wall or the ground, the amount of collision they have had with the ground and the average distance that they were from the target (if left on). These are then used to calculate a fitness score in the calculateFitness() function (line 214) in the [script.js file](/script.js), where they are then compared to all the other fitness scores of the group. This process is then repeated every 10 seconds as a new generation is introduced.

# Screenshots

<p>
    <img src="https://github.com/GameDev46/neural_drones/assets/76485006/056e37c4-eacd-42ee-a4e1-e44932ffb552" width="700">
</p>


## Saving and Loading

You can save and load the networks using the save and load button located on the settings panel, by default the networks are saved to the localstorage of your browser, but this not only has a cap on the amount of data that can be stored but also is reset if your search history is cleared so I would reccomend using thr save button instead. When you press the save button a JSON object s copied to your clipboard which you can then paste into notepad or another text editing software before then saving that to your device.

To load a saved neural network simply copy the contents of the save file you created to your clipboard before then hittin load, the program will then read the copied JSON object from your clipboard and load the neural netowrks with the saved settings and will even restore the generation count that they were saved on.

## Website

You can try out neural drones [here on its website](https://gamedev46.github.io/neural_drones/), or you can fork the repository and download and run it on your own device!
