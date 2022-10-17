
import { EnemyBehaviors } from "./EnemyBeahaviors.js";
import { ObjectBehaviors } from "./ObjectBehaviors.js";
import { PlayerBehaviors } from "./PlayerBeahaviors.js";
import { PointBehaviors } from "./PointBeahaviors.js";

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
	addMesh(gl, glPlane, alias, pathOBJ, isPlayer, isEnemy, idleAnimation, coords) {

		console.log("MeshLoader.js - Start loading mesh: " + alias);

		// Create the mesh object
		let mesh = [];
		mesh.sourceMesh = pathOBJ;

		// Load the mesh from the .obj file
		LoadMesh(gl, glPlane, mesh);
		
		console.debug(gl);

		// Add the mesh to the list of objects
		switch (alias) {
			case "Player":
				this.objData.push(
					new PlayerBehaviors(alias, mesh, coords));
				break;
			case "Point":
				this.objData.push(
					new PointBehaviors(alias, mesh, coords));
				break;
			case "Enemy":
				this.objData.push(
					new EnemyBehaviors(alias, mesh, coords));
				break;
			default:
				this.objData.push(
					new ObjectBehaviors(alias, mesh, isPlayer, isEnemy, idleAnimation, coords));
				break;
		}

		console.log("MeshLoader.js - End loading mesh: " + alias);
	}

}
