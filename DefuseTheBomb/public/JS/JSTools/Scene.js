// Definizione della classe "Scene".
export class Scene {
	// Costruttore della classe "Scene".
	constructor(name) {
		this.sceneName = name;
		this.objs = [];
	}

	// Funzione che permette di aggiungere un elemento e le sue caratteristiche ad una scena.
	addOBJToList(alias, pathOBJ, isPlayer, isEnemy, idleAnimation, coords) {
		var newObj = {
			alias: alias,
			pathOBJ: pathOBJ,
			isPlayer: isPlayer,
			isEnemy: isEnemy,
			idleAnimation: idleAnimation,
			coords: coords,
		};
		this.objs.push(newObj);
	}
}
