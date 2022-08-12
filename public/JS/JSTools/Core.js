import { MeshLoader } from "./MeshLoader.js";
import { setControls } from "./Control.js";

let gl;
let meshlist = [];
let delta;
let canvas;

// Definizione della classe "Core".
export class Core {
	// Costruttore della classe "Core".
	constructor(idCanvas) {
		// Acquisizione del constesto.
		this.canvas = document.getElementById(idCanvas);
		// Creazione di un contesto di rendering WebGL.
		this.gl = this.canvas.getContext("experimental-webgl");
		if (!this.gl) return;
		// Elementi di costruzione della scena.
		this.meshlist = [];
		this.loader = new MeshLoader(this.meshlist);
		// Set controlli movimento
		this.delta = { x: 0, y: 0, z: 0 };
		setControls(this.canvas, this.delta);
		// Passaggio alle variabili globali delle variabili appartenenti
		// al core.
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
				obj.path,
				this.gl,
				obj.player,
				obj.active,
				obj.coords,
				obj.alias
			);
		}
		// Aggiornamento della lista contenente i dati riguardante gli oggetti della scena
		meshlist = this.meshlist;
	}
}

let onetime = true;

export function render(time = 0) {
	// setup GLSL program
	let program = webglUtils.createProgramFromScripts(gl, [
		"3d-vertex-shader",
		"3d-fragment-shader",
	]);
	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);

	// TODO: Renderizzare solo se vi è una modifica.
	
	meshlist.forEach((elem) => {
		elem.render(
			gl,
			{ ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] },
			program,
			find_actor_coords(),
			// [0, 0, 0],
			delta
			// Camera obj
		);
	});

	delta.x = 0;
	delta.y = 0;
	delta.z = 0;

	// var modelXRotationRadians = degToRad(0);
	// var modelYRotationRadians = degToRad(0);

	// canvas.onmousedown = mouseDown;
	// canvas.onmouseup = mouseUp;
	// canvas.onmousemove = mouseMove;

	function computeMatrix(viewProj, translation, rotX, rotY) {
		let matrix = m4.translate(
			viewProj,
			translation[0],
			translation[1],
			translation[2]
		);
		matrix = m4.xRotate(matrix, rotX);
		return m4.yRotate(matrix, rotY);
	}

	requestAnimationFrame(render);
}

function find_actor_coords() {
	let actor = null;
	for (let i = 0; i < meshlist.length; i++) {
		if (meshlist[i].isPlayer) {
			actor = meshlist[i];
			break;
		}
	}
	console.log(
		actor.mesh.positions[0],
		actor.mesh.positions[1],
		actor.mesh.positions[2]
	);
	return [
		actor.mesh.positions[0],
		actor.mesh.positions[1],
		actor.mesh.positions[2],
	];
}

/*================= Mouse events ======================*/

function degToRad(d) {
	return (d * Math.PI) / 180;
}

var drag;
var THETA = degToRad(50),
	PHI = degToRad(30);
var old_x, old_y;
var dX, dY;

var mouseDown = function (e) {
	drag = true;
	(old_x = e.pageX), (old_y = e.pageY);
	e.preventDefault();
	return false;
};

var mouseUp = function (e) {
	drag = false;
};

var mouseMove = function (e) {
	if (!drag) return false;
	dX = (-(e.pageX - old_x) * 2 * Math.PI) / canvas.width;
	dY = (-(e.pageY - old_y) * 2 * Math.PI) / canvas.height;
	THETA += dX;
	PHI += dY;
	(old_x = e.pageX), (old_y = e.pageY);
	e.preventDefault();
	console.log((THETA, PHI));
};

/*================= Mouse events ======================*/
