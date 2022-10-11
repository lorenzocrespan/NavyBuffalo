import { Scene } from "./JSTools/Scene.js";
import { Core, render } from "./JSTools/Core.js";

/********************************************************************************************/

console.log("Inizio del caricamento degli elementi della scena");

// Creazione di una variabile locale "sceneComposition" che conterrà tutti
// gli elementi che faranno parte della scena da renderizzare.
let sceneComposition = new Scene("DefusesTheBomb");

// Aggiunta elementi alla scena
sceneComposition.addOBJToList(
	"Arena",						// alias
	"./OBJModels/WHGArena.obj",		// pathOBJ
	false,							// isPlayer
	false,							// isEnemy
	false,							// idleAnimation
	{								// coords
		x: 0,
		y: 0,
		z: 0,
	}
);
sceneComposition.addOBJToList(
	"Player",
	"./OBJModels/WHGPlayer.obj",
	true,
	false,
	false,
	{
		x: 0,
		y: 0,
		z: 0,
	}
);
sceneComposition.addOBJToList(
	"Enemy",
	"./OBJModels/WHGEnemy.obj",
	false,
	true,
	false,
	{
		x: 4,
		y: 0,
		z: -4,
	}
);
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

console.log("Oggetti scena");
console.debug(sceneComposition);
console.log("Conclusione del caricamento degli elementi della scena");

/********************************************************************************************/

console.log("Inizio del caricamento del core del programma");

// Creazione di una variabile locale "core" che conterrà il cuore del
// programma per permettere la corretta renderizzazione.
let core = new Core("screenCanvas");

// console.log("Core del programma prima del caricamento della scena");
// console.debug(core);
// Per poter vedere lo stato dei dati contenuti nel core prima del
// caricamento della scena è necessario fermare il programma.
// Esistono ovviamente sistemi più adeguati, ma il lancio di un errore
// è sicuramente efficace.
// throw new Error("Errore lanciato per permettere la visualizzazione dello stato del core");

core.setScene(sceneComposition);

core.generateCamera();

console.log("Core del programma dopo il caricamento della scena");
console.debug(core);
console.log("Conclusione del caricamento del core del programma");

/********************************************************************************************/

console.log("Rendering del core");
render();