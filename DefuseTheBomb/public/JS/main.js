import {
	disableDefaultPageScroll,
	visibleLog,
	countEnemies,
	countPoints,
} from "./JSProject/ControlPanel.js";

import { Scene } from "./JSProject/Scene.js";
import { Core, initProgramRender, render } from "./JSProject/Core.js";

if (visibleLog) console.log("main.js - Start setup page");

disableDefaultPageScroll();

if (visibleLog) console.log("main.js - End setup page");

if (visibleLog) console.log("main.js - Start loading scene elements");

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
sceneComposition.addOBJToList(
	"Player",
	"./OBJModels/WHGPlayer.obj",
	true,
	false,
	false,
	{ x: 0, y: 0, z: 0 }
);

if (visibleLog) console.debug(sceneComposition);
if (visibleLog) console.log("main.js - End loading scene elements");

if (visibleLog) console.log("main.js - Start loading core");

let core = new Core("screenCanvas", "screenCanvasPlane");

core.setupScene(sceneComposition);

if (visibleLog) console.debug(core);
if (visibleLog) console.log("main.js - End loading core");

if (visibleLog) console.log("main.js - Loop rendering");

initProgramRender();
render();
