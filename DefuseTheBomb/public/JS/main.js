import {
	disableDefaultPageScroll,
	countEnemies,
	countPoints,
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
//		-	Player
sceneComposition.addOBJToList(
	"Arena",
	"./OBJModels/WHGArena.obj",
	false,
	false,
	false,
	{ x: 0, y: 0, z: 0 }
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
			x: -7,
			y: -0.1,
			z: 0,
		}
	);
}
/*
sceneComposition.addOBJToList(
	"Player",
	"./OBJModels/WHGPlayer.obj",
	true,
	false,
	false,
	{ x: 0, y: 0, z: 0 }
);
*/
sceneComposition.addOBJToList(
	"Player",
	"./OBJModels/untitled.obj",
	true,
	false,
	false,
	{ x: 0, y: 0, z: 0 }
);

let core = new Core("screenCanvas", "screenCanvasPlane");

core.setupScene(sceneComposition);

initProgramRender();
render();
