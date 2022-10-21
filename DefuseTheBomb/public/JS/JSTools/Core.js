
import { MeshLoader } from "./MeshLoader.js";

import { Camera, setCameraControls, getUpdateCamera } from "./Camera.js";
import { setPlayerControls } from "./PlayerListener.js";
import { CollisionAgent } from "./CollisionAgent.js";
import { PlayerBehaviors } from "./PlayerBeahaviors.js";

// WebGL context
let glMainScreen;
let glSideScreen;
let isMainScreen = true;
// Camera
let cameraMainScreen;
let cameraSideScreen;
let actCamera;
// List of objects to render
let meshlist = [];

let listPrograms = [];

// Collision agent
let collisionAgent = new CollisionAgent();

// TODO: Evaluate if this is the best way to do this
let moveVectore;

export class Core {

	/**
	 * Constructor of the class. 
	 * It initializes the canvas, the WebGL context and all the components for the rendering.
	 * 
	 * @param {String} idMainCanvas Identifier of the canvas element (Main screen).
	 * @param {String} idSideCanvas Identifier of the canvas element (Side screen for the minimap).
	 */
	constructor(idMainCanvas, idSideCanvas) {
		console.log("Core.js - Start WebGL Core initialization");

		// Canvas and WebGL context initialization
		this.mainCanvas = document.getElementById(idMainCanvas);
		this.glMainScreen = this.mainCanvas.getContext("webgl");
		this.sideCanvas = document.getElementById(idSideCanvas);
		this.glSideScreen = this.sideCanvas.getContext("webgl");
		// Global variables initialization
		glMainScreen = this.glMainScreen;
		glSideScreen = this.glSideScreen;

		if (!this.glSideScreen || !this.glMainScreen) return;

		// MeshLoader initialization
		this.meshlist = [];
		this.meshLoader = new MeshLoader(this.meshlist);
		// Global variables initialization
		meshlist = this.meshlist;

		// Movement and camera controls initialization
		this.moveVectore = { x: 0, y: 0, z: 0 };
		setPlayerControls(this.mainCanvas);
		setCameraControls(this.mainCanvas, false);
		// Global variables initialization
		moveVectore = this.moveVectore;

		console.log("Core.js - End WebGL Core initialization");
	}

	/**
	 * Function setup all the components for the rendering.
	 * 
	 * @param {List} sceneComposition List of objects that will be rendered in the scene.
	 */
	setupScene(sceneComposition) {
		console.log("Core.js - Start scene setup");

		// Load all the meshes in the scene
		for (const obj of sceneComposition.sceneObj) {
			// Load the mesh
			this.meshLoader.addMesh(
				this.glMainScreen,
				this.glSideScreen,
				obj.alias,
				obj.pathOBJ,
				obj.coords,
				collisionAgent
			);
		}
		collisionAgent.countCollisionObject();
		console.log("Core.js - End scene setup");
	}

	/**
	 * Function that generates the camera for the rendering.
	 * 
	 */
	generateCamera() {
		console.log("Core.js - Start camera setup");

		cameraMainScreen = new Camera(
			[0, 0, 0],
			[0, 0, 1],
			[0, 0, 1],
			70
		);

		cameraSideScreen = new Camera(
			[0, 1, 40],
			[-1, 0, 0],
			[0, 0, 0],
			12
		);

		console.log("Core.js - End camera setup");
	}

}

export function initProgramRender() {
	// setup GLSL program
	let mainProgram = webglUtils.createProgramFromScripts(glMainScreen, [
		"3d-vertex-shader",
		"3d-fragment-shader",
	]);

	let sideProgram = webglUtils.createProgramFromScripts(glSideScreen, [
		"3d-vertex-shader",
		"3d-fragment-shader",
	]);

	glMainScreen.useProgram(mainProgram);
	glSideScreen.useProgram(sideProgram);

	// List of list of programs
	listPrograms = [[mainProgram, glMainScreen], [sideProgram, glSideScreen]];

	actCamera = cameraMainScreen;
}

/**
 * Rendering functions for the main screen.
 * 
 * @param {*} time 
 */
export function render(time = 0) {

	for (const program of listPrograms) {

		if (getUpdateCamera()) cameraMainScreen.moveCamera();

		// Convert to seconds
		time *= 0.002;

		meshlist.forEach((elem) => {

			switch (true) {
				case elem instanceof PlayerBehaviors:
					// Update the player vector
					if (isMainScreen) elem.playerListener.updateVector(elem.position);
					elem.render(
						time,
						program[1],
						{ ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] },
						program[0],
						actCamera,
						isMainScreen
					);
					break;
				default:
					elem.render(
						time,
						program[1],
						{ ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] },
						program[0],
						actCamera,
						isMainScreen
					);
					break;
			}
		}
		);

		if (actCamera == cameraMainScreen) {
			collisionAgent.checkCollisionEnemy();
			collisionAgent.checkCollisionPoint();
			isMainScreen = false;
			actCamera = cameraSideScreen;
		}
		else {
			actCamera = cameraMainScreen;
			isMainScreen = true;
		}

	}

	requestAnimationFrame(render);
}
