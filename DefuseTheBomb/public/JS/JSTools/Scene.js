
// Note:	In Javascript, the "export" keyword permits to export the class to other files.
//			When we export the class, we can use all the methods and properties of the class in other 
//			files.
export class Scene {

	/**
	 * Costuctor of the Scene class.
	 * 
	 * @param {string} name - The name of the scene
	 * @param {object} objs - An array of objects that will be rendered in the scene
	 */
	constructor(name, objs = []) {
		this.sceneName = name;
		this.objs = objs;
	}

	/**
	 * Add an object to the scene.
	 * 
	 * @param {string} alias - A string that will be used to identify the object
	 * @param {string} pathOBJ - The path to the .obj file
	 * @param {boolean} isPlayer - A boolean that indicates if the object is the player
	 * @param {boolean} isEnemy - A boolean that indicates if the object is an enemy
	 * @param {boolean} idleAnimation - A boolean that indicates if the object has an idle animation
	 * @param {object} coords - An object that contains the coordinates of the object inside the scene
	 * 
	 * @returns {boolean} - True if the object has been added, false otherwise
	 */
	addOBJToList(alias, pathOBJ, isPlayer, isEnemy, idleAnimation, coords) {
		var newObj = {
			alias: alias,
			pathOBJ: pathOBJ,
			isPlayer: isPlayer,
			isEnemy: isEnemy,
			idleAnimation: idleAnimation,
			coords: coords,
		};
		if (this.objs.push(newObj)) {
			console.log("Scene.js - Added new object to the scene");
			return true;
		} else {
			console.log("Scene.js - Error while adding new object to the scene");
			console.debug(newObj);
			return false;
		}
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
		for (var i = 0; i < this.objs.length; i++) {
			if (this.objs[i].alias === alias) {
				this.objs.splice(i, 1);
				return true;
			}
		}
		return false;
	}

}
