import { MeshLoader } from "./MeshLoader.js";
import { Camera, setCameraControls, getUpdateCamera } from "./Camera.js";
import { setPlayerControls } from "./PlayerListener.js";

let gl;
let meshlist = [];
let delta;
let canvas;
let camera;

// Definizione della classe "Core".
export class Core {
	// Costruttore della classe "Core".
	constructor(idCanvas) {
		// Acquisizione del constesto.
		this.canvas = document.getElementById(idCanvas);
		// Creazione di un contesto di rendering WebGL.
		this.gl = this.canvas.getContext("experimental-webgl");
		if (!this.gl) return;
		// Creazione della camera
		// Elementi di costruzione della scena.
		this.meshlist = [];
		this.loader = new MeshLoader(this.meshlist);
		// Set controlli movimento
		this.delta = { x: 0, y: 0, z: 0 };
		// setControls(this.canvas, this.delta);
		// Aggiunta dei listener per gli eventi della camera
		setCameraControls(this.canvas, false);
		// Aggiunta dei listener per gli eventi del player
		setPlayerControls(this.canvas, true);
		// Passaggio alle variabili globali delle variabili appartenenti al core.
		gl = this.gl;
		canvas = this.canvas;
		meshlist = this.meshlist;
		delta = this.delta;
	}

	// Funzione che permette di aggiornare i dati contenuti nel core per la
	// renderizzazione.
	setScene(sceneComposition) {
		console.log("Caricamento degli elementi che costituiscono la scena");
		// Ciclo per ogni elemento che costituisce la scena
		for (const obj of sceneComposition.objs) {
			console.debug(obj);
			// Richiamo della funzione di MeshLoader
			this.loader.load(
				this.gl,
				obj.alias,
				obj.pathOBJ,
				obj.isPlayer,
				obj.isEnemy,
				obj.idleAnimation,
				obj.coords
			);
		}
		// Aggiornamento della lista contenente i dati riguardante gli oggetti della scena
		meshlist = this.meshlist;
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
			delta
		);
	});
	requestAnimationFrame(render);
}
