
import { ObjectBehaviors } from "./ObjectBehaviors.js";

export class MeshLoader {
	
	/**
	 * Constructor of the class. 
	 * It initializes the list of all objects in the scene.
	 * 
	 * @param {List} objData List of all objects in the scene.
	 */
	constructor(objData) {
		this.objData = objData;
	}

	// Load the mesh from the .obj file and add it to the list of objects
	loadMesh(gl, alias, pathOBJ, isPlayer, isEnemy, idleAnimation, coords) {

		console.log("MeshLoader.js - Start loading mesh: " + alias);
		
		// Create the mesh object
		let mesh = [];
		mesh.sourceMesh = pathOBJ;

		// Load the mesh from the .obj file
		LoadMesh(gl, mesh);

		// Add the mesh to the list of objects
		this.objData.push(
			new ObjectBehaviors(alias, mesh, isPlayer, isEnemy, idleAnimation, coords)
		);

		console.log("MeshLoader.js - End loading mesh: " + alias);
	}
}
