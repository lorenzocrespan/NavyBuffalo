import {
	disableDefaultPageScroll,
	countEnemies,
	countPoints,
	countModifiers,
} from "./JSProject/ControlPanel.js";
import { Scene } from "./JSProject/Scene.js";
import { Core, initProgramRender, render } from "./JSProject/Core.js";

disableDefaultPageScroll();

// Array of objects that will be rendered in the scene
let sceneComposition = new Scene();

// Add objects to the scene:
//		-	Arena
//		-	Enemies
//		-	Points
//		-	Buffer/Debuffer
//		-	Player
sceneComposition.addOBJToList(
	"Arena",
	"./OBJModels/Arena.obj",
	false,
	false,
	false,
	false,
	{ x: 0, y: 0, z: 0 }
);

for (let i = 0; i < countPoints; i++) {
	sceneComposition.addOBJToList(
		"Point",
		"./OBJModels/Point.obj",
		false,
		false,
		true,
		false,
		{
			x: -7,
			y: -0.1,
			z: 0,
		}
	);
};
sceneComposition.addOBJToList(
	"Player",
	"./OBJModels/Player.obj",
	true,
	false,
	false,
	false,
	{ x: 0, y: 0, z: 0 }
);
for (let i = 0; i < countEnemies; i++) {
	sceneComposition.addOBJToList(
		"Enemy",
		"./OBJModels/Enemy.obj",
		false,
		true,
		false,
		false,
		{
			x: Math.floor(Math.random() * 14 - 7),
			y: 0,
			z: Math.floor(Math.random() * 14 - 7),
		}
	);
}
for (let i = 0; i < countModifiers; i++) {
	sceneComposition.addOBJToList(
		"Modifier",
		"./OBJModels/Modifier.obj",
		false,
		false,
		true,
		false,
		{ 
			x: Math.floor(Math.random() * 14 - 7),
			y: 0,
			z: Math.floor(Math.random() * 14 - 7), 
		}
	);
};


let core = new Core("screenCanvas", "screenCanvasPlane");

core.setupScene(sceneComposition);

initProgramRender();
render();
