// TODO: Permettere di prendere in input più elementi, aggiungendoli alla lista.
// 		 Ergo cava sto hard code figlio di satana.

// Definizione della classe "Scene".
export class Scene {
	// Costruttore della classe "Scene".
	constructor(name) {
		this.sceneName = name;
		this.objs = [];
	}

	// Funzione che permette di aggiungere un elemento
	// e le sue caratteristiche ad una scena.
	addOBJToList(alias, path, player, active, coords) {
		var newObj = {
			alias: alias,
			path: path,
			player: player,
			active: active,
			coords: coords,
		};
		this.objs.push(newObj);
	}
}
