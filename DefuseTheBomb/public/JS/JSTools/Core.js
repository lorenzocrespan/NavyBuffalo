
import { MeshLoader } from "./MeshLoader.js";
import { Camera, setCameraControls, getUpdateCamera } from "./Camera.js";
import { setPlayerControls } from "./PlayerListener.js";
import { PointBehaviors } from "./PointBeahaviors.js";
import { PlayerBehaviors } from "./PlayerBeahaviors.js";
import { EnemyBehaviors } from "./EnemyBeahaviors.js";


let gl;
let glPlane;
let meshlist = [];
let moveVectore;
let canvas;
let camera;
let cameraPlane;

export class Core {

	/**
	 * Constructor of the class. 
	 * It initializes the canvas, the WebGL context and all the components for the rendering.
	 * 
	 * @param {String} idCanvas Identifier of the canvas element
	 */
	constructor(idCanvas, screenCanvasPlane) {
		console.log("Core.js - Start WebGL Core initialization");

		// Canvas and WebGL context initialization
		this.canvas = document.getElementById(idCanvas);
		this.gl = this.canvas.getContext("webgl");
		if (!this.gl) return;

		this.cameraPlane = document.getElementById(screenCanvasPlane);
		this.glPlane = this.cameraPlane.getContext("webgl");
		if (!this.glPlane) return;

		// MeshLoader initialization
		this.meshlist = [];
		this.meshLoader = new MeshLoader(this.meshlist);

		// Movement controls initialization
		this.moveVectore = { x: 0, y: 0, z: 0 };
		setPlayerControls(this.canvas);

		// Setup camera controls (mouse and keyboard listeners)
		setCameraControls(this.canvas, false);

		// Global variables initialization
		gl = this.gl;
		glPlane = this.glPlane;
		canvas = this.canvas;
		meshlist = this.meshlist;
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
		for (const obj of sceneComposition.objs) {
			console.debug(obj);
			// Load the mesh
			this.meshLoader.addMesh(
				this.gl,
				this.glPlane,
				obj.alias,
				obj.pathOBJ,
				obj.isPlayer,
				obj.isEnemy,
				obj.idleAnimation,
				obj.coords
			);
		}
		console.log("Core.js - End scene setup");
	}

	generateCamera() {
		camera = new Camera(
			[0, 0, 0],
			[0, 0, 1],
			[0, 0, 1],
			70
		);
	}

	generatePlaneCamera() {
		cameraPlane = new Camera(
			[0, 2, 50], 
			[0, 0, 1],  
			[0, 0, 1], 
			12.1
		);
	}
}

export function render(time = 0) {
	// setup GLSL program
	let program = webglUtils.createProgramFromScripts(gl, [
		"3d-vertex-shader",
		"3d-fragment-shader",
	]);

	let programPlane = webglUtils.createProgramFromScripts(glPlane, [
		"3d-vertex-shader",
		"3d-fragment-shader",
	]);

	gl.clearColor(0.25, 0.5, 0.75, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);
	glPlane.useProgram(programPlane);
	if (getUpdateCamera()) camera.moveCamera();

	// convert to seconds
	time *= 0.002;

	meshlist.forEach((elem) => {

		switch (true) {
			case elem instanceof PointBehaviors:
				elem.render(
					time,
					gl,
					{ ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] },
					program,
					camera,
					true
				);
				elem.render(
					time,
					glPlane,
					{ ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] },
					programPlane,
					cameraPlane,
					false
				);
				break;
			case elem instanceof PlayerBehaviors:
				// Update the player vector
				elem.playerListener.updateVector(elem.position);

				elem.render(
					time,
					gl,
					{ ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] },
					program,
					camera,
					moveVectore
				);
				break;
			case elem instanceof EnemyBehaviors:
				elem.render(
					time,
					gl,
					{ ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] },
					program,
					camera,
				);
				break;
			default:
				elem.render(
					time,
					gl,
					{ ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] },
					program,
					camera,
					moveVectore
				);
				break;
		}
	});

	requestAnimationFrame(render);
}
