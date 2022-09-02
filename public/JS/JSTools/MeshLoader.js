import { ObjectBehaviors } from "./ObjectBehaviors.js";

// Definizione della classe "MeshLoader".
export class MeshLoader {
	// Costruttore della classe "MeshLoader".
	constructor(list) {
		this.list = list;
	}

	// Funzione che permette di creare gli effettivi elementi della scena.
	load(gl, alias, pathOBJ, isPlayer, isEnemy, idleAnimation, coords) {
		console.log("Inizio caricamento dell'elemento della scena");
		// Creazione array per la mesh e il path all'OBJ
		let mesh = [];
		mesh.sourceMesh = pathOBJ;

		console.log("Caricamento della mesh dell'elemento della scena");
		LoadMesh(gl, mesh);

		console.log("Caricamento comportamento dell'elemento della scena");
		this.list.push(
			new ObjectBehaviors(alias, mesh, isPlayer, isEnemy, idleAnimation, coords)
		);
		console.log("Conclusione caricamento dell'elemento della scena");
	}
}
