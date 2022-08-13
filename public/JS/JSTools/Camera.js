// Parametri globali utilizzati all'interno di Camera.js.
//
let drag;
let THETA = 0,
	PHI = 0;
let old_x, old_y;
let dX, dY;
//
var angle;

// Definizione della classe "Camera".
// A suo interno vi è la completa gestione delle caratteristiche relative
// alla camera.
export class Camera {
	// Costruttore della classe "Camera".
	// position, posizione spaziale (x, y, z) della camera.
	// up, ...
	// target, soggetto della scena.
	// radius, distanza dal soggetto della scena.
	// fieldOfView, ...
	constructor(position, up, target, radius, fieldOfView) {
		this.position = position;
		this.up = up;
		this.target = target;
		this.radius = radius;
		this.fieldOfView = fieldOfView;
		angle = 0;
	}

	radiusModify(radius) {
		return radius * Math.cos(PHI);
	}

	moveCamera() {
		const radius = 10;
		this.position[0] = Math.cos(THETA) * this.radiusModify(radius);
		this.position[1] = Math.sin(THETA) * this.radiusModify(radius);
		this.position[2] = Math.sin(PHI) * radius;
	}

	// Compute the camera's matrix using look at.
	cameraMatrix() {
		return m4.lookAt(this.position, this.target, this.up);
	}

	// Make a view matrix from the camera matrix.
	viewMatrix() {
		return m4.inverse(this.cameraMatrix());
	}

	// Compute the projection matrix
	projectionMatrix(gl) {
		let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		return m4.perspective(this.fieldOfView, aspect, 1, 2000);
	}
}

export function setCameraControls(canvas, isActive) {
	canvas.onmousedown = function (e) {
		console.log("Mouse down per il listener della camera.");
		drag = true;
		old_x = e.pageX;
		old_y = e.pageY;
		e.preventDefault();
		return false;
	};

	canvas.onmouseup = function (e) {
		console.log(THETA, PHI);
		drag = false;
	};

	canvas.onmousemove = function (e) {
		if (!drag) return false;
		dX = (-(e.pageX - old_x) * 2 * Math.PI) / canvas.width;
		dY = (-(e.pageY - old_y) * 2 * Math.PI) / canvas.height;
		THETA += dX;
		PHI += dY;
		old_x = e.pageX;
		old_y = e.pageY;
		e.preventDefault();
	};
}

// Funzioni potenzialmente esportabili perchè utilizzate da più JS.
function degToRad(d) {
	return (d * Math.PI) / 180;
}
