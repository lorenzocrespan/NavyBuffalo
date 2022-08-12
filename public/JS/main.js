import { Scene } from "./JSTools/Scene.js";
import { Core, render } from "./JSTools/Core.js";

/********************************************************************************************/

console.log("Inizio del caricamento degli elementi della scena");

// Creazione di una variabile locale "sceneComposition" che conterrà tutti
// gli elementi che faranno parte della scena da renderizzare.
let sceneComposition = new Scene("DefusesTheBomb");
// Aggiunta elementi alla scena
sceneComposition.addOBJToList(
	"Bomb",
	"./OBJModels/000_KeepTalk.obj",
	true,
	false,
	{ x: 0, y: 4, z: 0 }
);
sceneComposition.addOBJToList(
	"Ground",
	"./OBJModels/Ground.obj",
	false,
	false,
	{ x: 0, y: 2, z: 0 }
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

console.log("Core del programma dopo il caricamento della scena");
console.debug(core);
console.log("Conclusione del caricamento del core del programma");

/********************************************************************************************/

console.log("Rendering del core");
render();
