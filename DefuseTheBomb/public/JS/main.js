
import { Scene } from "./JSTools/Scene.js";
import { Core, initProgramRender, render } from "./JSTools/Core.js";


console.log("main.js - Start loading scene elements");

// Array of objects that will be rendered in the scene 
let sceneComposition = new Scene();
// Counter for the number of objects that have to be added to the scene
let countEnemies = 2;
let countPoints = 1;
// Add objects to the scene:
//		-	Arena
//		-	Player
//		-	Enemies
//		-	Points
sceneComposition.addOBJToList(
	"Arena",
	"./OBJModels/WHGArena.obj",
	false,
	false,
	false,
	{ x: 0, y: 0, z: 0 },
	1
);
sceneComposition.addOBJToList(
	"Player",
	"./OBJModels/WHGPlayer.obj",
	true,
	false,
	false,
	{ x: 0, y: 0, z: 0 },
	1
);
for (let i = 0; i < countEnemies; i++) {
	sceneComposition.addOBJToList(
		"Enemy",
		"./OBJModels/WHGEnemy.obj",
		false,
		true,
		false,
		{
			x: Math.floor(Math.random() * 10 - 8),
			y: 0,
			z: Math.floor(Math.random() * 10 - 8),
		}
	);
}
for (let i = 0; i < countPoints; i++) {
	sceneComposition.addOBJToList(
		"Point",
		"./OBJModels/WHGPoint.obj",
		false,
		false,
		true,
		{
			x: Math.floor(Math.random() * 10 - 8),
			y: -0.1,
			z: Math.floor(Math.random() * 10 - 8),
		}
	);
}
console.debug(sceneComposition);

console.log("main.js - End loading scene elements");



console.log("main.js - Start loading core");

let core = new Core("screenCanvas", "screenCanvasPlane");

core.setupScene(sceneComposition);

core.generateCamera();

console.log("Core del programma dopo il caricamento della scena");
console.debug(core);

console.log("main.js - End loading core");



console.log("main.js - Loop rendering");	

initProgramRender();
render();
