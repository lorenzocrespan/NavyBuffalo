import { maxRadius, minRadius } from "../ControlPanel.js";

let radius = 24;
let updateCamera = true;
let zoomIn = false;
let zoomOut = false;
let drag;
let angleX = degToRad(180);
let angleY = degToRad(45);
let oldX, oldY;
let deltaX, deltaY;
let isResetCamera = false;

// Enum typeCamera
export const typeCamera = {
	MainCamera: 0,
	SideCamera: 1,
};

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

	smoothZoomIn() {
		if (radius > minRadius) {
			radius -= 0.1;
			updateCamera = true;
		}
	}

	smoothZoomOut() {
		if (radius < maxRadius) {
			radius += 0.1;
			updateCamera = true;
		}
	}

	smoothReset() {
		if (angleX > degToRad(180)) angleX -= 0.01;
		if (angleX < degToRad(180)) angleX += 0.01;
		if (angleY > degToRad(45)) angleY -= 0.01;
		if (angleY < degToRad(45)) angleY += 0.01;
	}

	radiusModify(radius) {
		return radius * Math.cos(angleY);
	}

	resetCamera() {
		updateCamera = true;
		this.smoothReset();
		if (angleX > degToRad(179) && angleX < degToRad(181)) angleX = degToRad(180);
		if (angleY > degToRad(44) && angleY < degToRad(46)) angleY = degToRad(45);
		if (angleX == degToRad(180) && angleY == degToRad(45)) isResetCamera = false;
	}

	moveCamera() {
		if (isResetCamera) this.resetCamera();
		if (zoomIn) this.smoothZoomIn();
		if (zoomOut) this.smoothZoomOut();
		if (this.cameraControlsEnabled & updateCamera) {
			this.position[0] = this.radiusModify(radius) * Math.cos(angleX);
			this.position[1] = this.radiusModify(radius) * Math.sin(angleX);
			this.position[2] = radius * Math.sin(angleY);
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

export function setCameraControls(canvas) {
	// Mouse camera controls.

	canvas.addEventListener("mousedown", function (event) {
		drag = true;
		(oldX = event.pageX), (oldY = event.pageY);
		return false;
	});

	canvas.addEventListener("mouseup", function (event) {
		drag = false;
	});

	canvas.addEventListener("mousemove", function (event) {
		if (!drag) return false;
		deltaY = (-(event.pageY - oldY) * 2 * Math.PI) / canvas.height;
		deltaX = (-(event.pageX - oldX) * 2 * Math.PI) / canvas.width;
		angleX += deltaX;
		angleY -= deltaY;
		if (angleY > degToRad(75)) angleY = degToRad(75);
		if (angleY < degToRad(25)) angleY = degToRad(25);
		oldY = event.pageY;
		oldX = event.pageX;
		updateCamera = true;
	});

	// Arrow keys zoom in and out camera controls.

	window.addEventListener("keydown", function (event) {
		switch (event.key) {
			case "ArrowUp":
				zoomIn = true;
				break;
			case "ArrowDown":
				zoomOut = true;
				break;
			case "r":
				isResetCamera = true;
				break;
		}
		updateCamera = true;
	});

	window.addEventListener("keyup", function (event) {
		switch (event.key) {
			case "ArrowUp":
				zoomIn = false;
				break;
			case "ArrowDown":
				zoomOut = false;
				break;
		}
		updateCamera = false;
	});
}

// Convert degrees to radians.
function degToRad(d) {
	return (d * Math.PI) / 180;
}

function radToDeg(r) {
	return (r * 180) / Math.PI;
}
