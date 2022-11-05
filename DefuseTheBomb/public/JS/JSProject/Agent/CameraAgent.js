// TODO: Fare una capera con visuale fissa non collocata nella sfera.
// TODO: Funzione che riporta "lentamente" la telecamera principale alla posizione di partenza.
// TODO: Bind delle frecce direzionali per il zoom in e zoom out.

// Global variables

let updateCamera = true;
// Parametri globali utilizzati all'interno di Camera.js.
let drag;
let THETA = degToRad(180),
	PHI = degToRad(45);
let old_x, old_y;
let dX, dY;

//
let radius = 24;
let maxRadius = 24,
	minRadius = 3;

// Enum typeCamera
export const typeCamera = {
	MainCamera: 0,
	SideCamera: 1,
};

// Global methods

// Convert degrees to radians.
function degToRad(d) {
	return (d * Math.PI) / 180;
}

export class Camera {
	constructor(
		typeCamera,
		cameraControlsEnabled,
		position,
		up,
		target,
		fieldOfView
	) {
		this.typeCamera = typeCamera;
		this.position = position;
		this.up = up;
		this.target = target;
		this.fieldOfView = fieldOfView;
		this.cameraControlsEnabled = cameraControlsEnabled;
	}

	radiusModify(radius) {
		return radius * Math.cos(PHI);
	}

	moveCamera() {
		if (this.cameraControlsEnabled) {
			console.log("Camera update");
			this.position[0] = this.radiusModify(radius) * Math.cos(THETA);
			this.position[1] = this.radiusModify(radius) * Math.sin(THETA);
			this.position[2] = radius * Math.sin(PHI);
		}
		updateCamera = false;
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

export function getUpdateCamera() {
	return updateCamera;
}

export function setCameraControls(canvas) {
	window.addEventListener("keydown", onKeyDown, true);


	canvas.addEventListener("mousedown", function (event) {
		drag = true;
		old_x = event.pageX,
		old_y = event.pageY;
		return false;
	});

	canvas.addEventListener("mouseup", function (event) {
		drag = false;
		
	});

	canvas.addEventListener("mousemove", function (event) {
		// Print data mouse
		console.log("X: " + event.pageX + " Y: " + event.pageY);
		if (!drag) return false;
		updateCamera = true;
		dY = (-(event.pageY - old_y) * 2 * Math.PI) / canvas.height;
		PHI -= dY;
		if (PHI > degToRad(75)) PHI = degToRad(75);
		if (PHI < degToRad(25)) PHI = degToRad(25);
		old_y = event.pageY;
		dX = (-(event.pageX - old_x) * 2 * Math.PI) / canvas.width;
		THETA += dX;
		old_x = event.pageX;
	});

	function smoothZoomInOut() {
		if (radius > minRadius) {
			radius -= 0.1;
			updateCamera = true;
		}
	}

	function smoothZoomOut() {
		if (radius < maxRadius) {
			radius += 0.1;
			updateCamera = true;
		}
	}

	function onKeyDown(event) {
		switch (event.keyCode) {
			case 38:
				// Up
				smoothZoomInOut();
				break;
			case 40:
				// Down
				smoothZoomOut();
				break;
		}
	}
}