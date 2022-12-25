export class Scene {
	/**
	 * Costuctor of the class.
	 *
	 * @param {string} name - The name of the scene.
	 * @param {object} sceneObj - An array of objects that will be rendered in the scene.
	 */
	constructor(name = "defaultSceneComposition", sceneObj = []) {
		this.sceneName = name;
		this.sceneObj = sceneObj;
	}

	/**
	 * Add an object to the scene.
	 *
	 * @param {String} alias A string that will be used to identify the object
	 * @param {String} pathOBJ The path to the .obj file
	 * @param {boolean} isPlayer A boolean that indicates if the object is the player
	 * @param {boolean} isEnemy A boolean that indicates if the object is an enemy
	 * @param {boolean} isVariant A boolean that indicates if the object is a buffer or debuffer of other objects
	 * @param {boolean} idleAnimation A boolean that indicates if the object has an idle animation
	 * @param {object} coords An object that contains the coordinates of the object inside the scene
	 *
	 * @returns {boolean} True if the object has been added, false otherwise
	 */
	addOBJToList(alias, pathOBJ, isPlayer, isEnemy, isVariant, idleAnimation, coords) {
		var newObj = {
			alias: alias,
			pathOBJ: pathOBJ,
			isPlayer: isPlayer,
			isEnemy: isEnemy,
			isVariant: isVariant,
			idleAnimation: idleAnimation,
			coords: coords,
		};
		if (this.sceneObj.push(newObj)) return true;
		else return false;
	}

	/**
	 * Remove an object from the scene.
	 *
	 * @param {string} alias - The alias of the object that will be removed
	 *
	 * @returns {boolean} - True if the object has been removed, false otherwise
	 *
	 */
	removeOBJFromList(alias) {
		for (var i = 0; i < this.sceneObj.length; i++) {
			if (this.sceneObj[i].alias === alias) {
				this.sceneObj.splice(i, 1);
				return true;
			}
		}
		return false;
	}
}
