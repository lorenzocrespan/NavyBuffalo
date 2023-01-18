import { MeshLoader } from "./MeshLoader.js";
import {
	getGameOver,
	setGameOver,
	resetPlayerScore,
	setReset,
	getActive,
	setActive,
	isSecondCameraActive
} from "./ControlPanel.js";
import {
	typeCamera,
	Camera,
	setCameraControls
} from "./Agent/CameraAgent.js";
import { setPlayerControls } from "./Agent/PlayerAgent.js";
import { CollisionAgent } from "./Agent/CollisionAgent.js";
import { PlayerBehaviour } from "./OBJBehaviour/PlayerBehaviour.js";
import { EnemyBehaviour } from "./OBJBehaviour/EnemyBehaviour.js";
import { ModifierBehaviour } from "./OBJBehaviour/ModifierBehaviour.js";
import { PointBehaviour } from "./OBJBehaviour/PointBehaviour.js";

// WebGL context data
let glMainScreen;
let glSideScreen;
let isMainScreen = true;
// Camera data
let cameraMainScreen;
let cameraSideScreen;
let actCamera;
// List of objects to render
let meshlist = [];
// Collision agent
let collisionAgent = new CollisionAgent();
// List of programs (associated webGL context and shader)
let listPrograms = [];
// Type of texture applied to the objects
let isAlternativeObj = false;

export class Core {
	/**
	 * Initialization of canvas, WebGL context and all the components for the rendering.
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
		meshlist = this.meshlist;
		// Movement and camera controls initialization
		setPlayerControls(this.mainCanvas);
		setCameraControls(this.mainCanvas);
	}

	/**
	 * Setup camera and scene elements.
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
			// Load mesh
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

/**
 * Function to reload the objects' textures.
 */
export function reloadTexture() {
	isAlternativeObj = !isAlternativeObj;
	// Change the texture of elements
	for (const elem of meshlist) {
		switch (elem.alias) {
			case "Player":
				// Save the actual position of the player
				let playerPos = elem.mesh.positions;
				// Change the texture
				if (isAlternativeObj) elem.mesh.sourceMesh = "./OBJModels/PlayerAlternative.obj";
				else elem.mesh.sourceMesh = "./OBJModels/Player.obj";
				LoadMesh(glMainScreen, glSideScreen, elem.mesh);
				// Restore the position
				elem.mesh.positions = playerPos;
				break;
			case "Enemy":
				// Save the actual position of the enemy
				let enemyPos = elem.mesh.positions;
				// Change the texture
				if (isAlternativeObj) elem.mesh.sourceMesh = "./OBJModels/EnemyAlternative.obj"
				else elem.mesh.sourceMesh = "./OBJModels/Enemy.obj";
				LoadMesh(glMainScreen, glSideScreen, elem.mesh);
				// Restore the position
				elem.mesh.positions = enemyPos;
				break;
			case "Point":
				// Save the actual position of the point
				let pointPos = elem.mesh.positions;
				// Change the texture
				if (isAlternativeObj) elem.mesh.sourceMesh = "./OBJModels/PointAlternative.obj";
				else elem.mesh.sourceMesh = "./OBJModels/Point.obj";
				LoadMesh(glMainScreen, glSideScreen, elem.mesh);
				// Restore the position
				elem.mesh.positions = pointPos;
				break;
			case "Arena":
				// Change the texture
				if (isAlternativeObj) elem.mesh.sourceMesh = "./OBJModels/ArenaAlternative.obj";
				else elem.mesh.sourceMesh = "./OBJModels/Arena.obj";
				LoadMesh(glMainScreen, glSideScreen, elem.mesh);
				break;
		}
	}
}

/**
 * Function to reset the game.
 */
export function resetGameCore() {
	// Reset object information
	meshlist.forEach((elem) => {
		elem.resetData();
	});
	collisionAgent.despawnAllEnemy();
	resetPlayerScore();
	setGameOver(false);
	setReset(false);
	setActive(false);
}

/**
 * Function to initialize the WebGL program.
 */
export function initProgramRender() {
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

	glSideScreen.enable(glSideScreen.DEPTH_TEST);
	glMainScreen.enable(glMainScreen.DEPTH_TEST);
	glMainScreen.enable(glMainScreen.BLEND);
	glMainScreen.blendFunc(glMainScreen.SRC_ALPHA, glMainScreen.ONE_MINUS_SRC_ALPHA);

	// List of list of programs
	listPrograms = [
		[mainProgram, glMainScreen],
		[sideProgram, glSideScreen],
	];

	actCamera = cameraMainScreen;
}

/**
 * Rendering functions for the main screen and the side screen.
 *
 * @param {Number} time Time of the render.
 */
export function render(time = 0) {
	for (const program of listPrograms) {
		if (!isSecondCameraActive && program[1] == glSideScreen) continue;
		// Update the camera information
		cameraMainScreen.moveCamera();
		time *= 0.002;
		// Render the scene
		meshlist.forEach((elem) => {
			switch (true) {
				case elem instanceof PlayerBehaviour:
					if (isMainScreen && getActive() && !getGameOver()) {
						collisionAgent.checkCollisionEnemyWithPlayer(elem.position);
						collisionAgent.checkCollisionPointWithPlayer(elem.position);
						elem.computePlayerPosition();
					}
					// Update render
					elem.render(
						program[1],
						program[0],
						actCamera,
						isMainScreen
					);
					break;
				case elem instanceof EnemyBehaviour:
					if (isMainScreen && (elem.isVisible || elem.isSpawning) && !getGameOver()) {
						collisionAgent.checkCollisionEnemyWithArena(elem);
						collisionAgent.checkCollisionEnemyWithEnemy();
						elem.computeEnemyPosition();
					}
					if (elem.isVisible || elem.isSpawning) {
						elem.render(
							time,
							program[1],
							program[0],
							actCamera,
							isMainScreen
						);
					}
					break;
				case elem instanceof ModifierBehaviour:
					if (isMainScreen && getActive() && !getGameOver()){
						collisionAgent.checkOverlapModifier(elem);
					}
					elem.render(
						program[1],
						program[0],
						actCamera,
						isMainScreen
					);
					break;
				case elem instanceof PointBehaviour:
					if (isMainScreen){
						elem.computeIdleAnimation(time);
					}
					elem.render(
						program[1],
						program[0],
						actCamera,
						isMainScreen
					);
					break;
				default:
					elem.render(
						program[1],
						program[0],
						actCamera,
						isMainScreen
					);
					break;
			}
		});
		// Switch camera
		if (isSecondCameraActive) {
			if (actCamera == cameraMainScreen) {
				isMainScreen = false;
				actCamera = cameraSideScreen;
			} else {
				actCamera = cameraMainScreen;
				isMainScreen = true;
			}
		}
	}
	requestAnimationFrame(render);

	if (!getGameOver()) {
		meshlist.forEach((elem) => {
			switch (true) {
				case elem instanceof PlayerBehaviour:
					if (isMainScreen) elem.playerListener.updateVector(elem.position);
					break;
			}
		});
	}
}
