
import { MeshLoader } from "./MeshLoader.js";
import { Camera, setCameraControls, getUpdateCamera } from "./Camera.js";
import { setPlayerControls } from "./PlayerListener.js";


let gl;
let meshlist = [];
let moveVectore;
let canvas;
let camera;

export class Core {

	/**
	 * Constructor of the class. 
	 * It initializes the canvas, the WebGL context and all the components for the rendering.
	 * 
	 * @param {String} idCanvas Identifier of the canvas element
	 */
	constructor(idCanvas) {
		console.log("Core.js - Start WebGL Core initialization");

		// Canvas and WebGL context initialization
		this.canvas = document.getElementById(idCanvas);
		this.gl = this.canvas.getContext("experimental-webgl");
		if (!this.gl) return;

		// MeshLoader initialization
		this.meshlist = [];
		this.meshLoader = new MeshLoader(this.meshlist);

		// Movement controls initialization
		this.moveVectore = { x: 0, y: 0, z: 0 };
		setPlayerControls(this.canvas, true);

		// Setup camera controls (mouse and keyboard listeners)
		setCameraControls(this.canvas, false);

		// Global variables initialization
		gl = this.gl;
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
			this.meshLoader.loadMesh(
				this.gl,
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
			[0, 0, 0], // Cordinate in cui è collocata la camera
			[0, 0, 1], //
			[0, 0, 1],
			70
		);
	}
}

export function render(time = 0) {
	// setup GLSL program
	let program = webglUtils.createProgramFromScripts(gl, [
		"3d-vertex-shader",
		"3d-fragment-shader",
	]);

	gl.clearColor(0.25, 0.5, 0.75, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);
	if (getUpdateCamera()) camera.moveCamera();

	// convert to seconds
	time *= 0.002;

	meshlist.forEach((elem) => {

		if (elem.isPlayer) {
			elem.playerListener.updatePosition();
		}

		elem.render(
			time,
			gl,
			{ ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] },
			program,
			camera,
			moveVectore
		);
	});
	requestAnimationFrame(render);
}
