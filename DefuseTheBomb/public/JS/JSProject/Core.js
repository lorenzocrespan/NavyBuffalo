import { MeshLoader } from "./MeshLoader.js";
import {
	getGameOver,
	setGameOver,
	getReset,
	setReset,
	getActive,
	setActive,
	isSecondCameraActive
} from "./ControlPanel.js";

import { typeCamera, Camera, setCameraControls } from "./Agent/CameraAgent.js";
import { setPlayerControls } from "./Agent/PlayerAgent.js";
import { CollisionAgent } from "./Agent/CollisionAgent.js";
import { PlayerBehaviour } from "./OBJBehaviour/PlayerBehaviour.js";
import { EnemyBehaviour } from "./OBJBehaviour/EnemyBehaviour.js";
import { ModifierBehaviour } from "./OBJBehaviour/ModifierBehaviour.js";

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

let isReset = false;

export class Core {
	/**
	 * Constructor of the class.
	 * It initializes the canvas, the WebGL context and all the components for the rendering.
	 *
	 * @param {String} idMainCanvas Identifier of the canvas element (Main screen).
	 * @param {String} idSideCanvas Identifier of the canvas element (Side screen for the minimap).
	 */
	constructor(idMainCanvas, idSideCanvas) {
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
		setPlayerControls(this.mainCanvas);
		setCameraControls(this.mainCanvas);
	}

	/**
	 * Function setup all the components for the rendering.
	 *
	 * @param {List} sceneComposition List of objects that will be rendered in the scene.
	 */
	setupScene(sceneComposition) {
		cameraMainScreen = new Camera(
			typeCamera.MainCamera,
			true,
			[0, 0, 0],
			[0, 0, 1],
			[0, 0, 1],
			70
		);
		cameraSideScreen = new Camera(
			typeCamera.SideCamera,
			false,
			[0, 0, 40],
			[-1, 0, 0],
			[0, 0, 0],
			100
		);
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
	listPrograms = [
		[mainProgram, glMainScreen],
		[sideProgram, glSideScreen],
	];

	actCamera = cameraMainScreen;
}

// TODO: Spostare la gestione del pulsante al control panel
document.getElementById("resetButton").onclick = function () {
	meshlist.forEach((elem) => {
		elem.resetData();
	});
	collisionAgent.despawnAllEnemy();
	collisionAgent.resetPlayerScore();
	setGameOver(false);
	setReset(true);
	setActive(false);
	render();
};

let hitDeltaPosition;
/**
 * Rendering functions for the main screen.
 *
 * @param {*} time
 */
export function render(time = 0) {
	for (const program of listPrograms) {
		
		if(!isSecondCameraActive && program[1] == glSideScreen) continue;
		
			cameraMainScreen.moveCamera();

			// Convert to seconds
			time *= 0.002;

			meshlist.forEach((elem) => {
				switch (true) {
					case elem instanceof PlayerBehaviour:
						// Update information
						if (isMainScreen && getActive()) {
							collisionAgent.checkCollisionEnemy(elem.position);
							collisionAgent.checkCollisionPoint(elem.position);
						}
						// Update render
						elem.render(
							program[1],
							{ ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] },
							program[0],
							actCamera,
							isMainScreen,
							hitDeltaPosition,
							false
						);
						break;
					case elem instanceof EnemyBehaviour:
						// Update the player vector
						if (isMainScreen && (elem.isVisible || elem.isSpawning)){
							collisionAgent.checkCollisionEnemyWithArena(elem);
							collisionAgent.checkCollisionEnemyWithEnemy(0.90);
						}
						if(elem.isVisible || elem.isSpawning){
							elem.render(
								time,
								program[1],
								{ ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] },
								program[0],
								actCamera,
								isMainScreen,
								false
							);
						}
						break;
					case elem instanceof ModifierBehaviour:
						// Update information
						if (isMainScreen && getActive()) 
							collisionAgent.checkOverlapModifier(elem);
						// Update render
						elem.render(
							time,
							program[1],
							{ ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] },
							program[0],
							actCamera,
							isMainScreen,
							false
						);
						break;
					default:
						elem.render(
							time,
							program[1],
							{ ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] },
							program[0],
							actCamera,
							isMainScreen,
							collisionAgent
						);
						break;
				}
			});

			if(isSecondCameraActive){
			if (actCamera == cameraMainScreen) {
				isMainScreen = false;
				actCamera = cameraSideScreen;
			} else {
				actCamera = cameraMainScreen;
				isMainScreen = true;
			}
			}
		
	}
	if (!getGameOver()) requestAnimationFrame(render);

	meshlist.forEach((elem) => {
		switch (true) {
			case elem instanceof PlayerBehaviour:
				if (isMainScreen) elem.playerListener.updateVector(elem.position);
				break;
		}
	});


}
