import { maxRadius, minRadius } from "../ControlPanel.js";

let radius = 24;
let updateCamera = true;
let zoomIn = false;
let zoomOut = false;
let leftRotation = false;
let rightRotation = false;
let drag;
let angleX = degToRad(180);
let angleY = degToRad(45);
let oldX, oldY;
let deltaX, deltaY;
let isResetCamera = false;
let lastDistance = 0;

// Enum for camera type
export const typeCamera = {
	MainCamera: 0,
	SideCamera: 1,
};

export class Camera {

	constructor(typeCamera, cameraControlsEnabled, position, up, target, fieldOfView) {
		this.typeCamera = typeCamera;
		this.position = position;
		this.up = up;
		this.target = target;
		this.fieldOfView = fieldOfView;
		this.cameraControlsEnabled = cameraControlsEnabled;
	}
	/**
	 * Function to reduce the radius of the camera position.
	 */
	smoothZoomIn() {
		if (radius > minRadius) {
			radius -= 0.1;
			updateCamera = true;
		}
	}

	/**
	 * Function to increase the radius of the camera position.
	 */
	smoothZoomOut() {
		if (radius < maxRadius) {
			radius += 0.1;
			updateCamera = true;
		}
	}

	/**
	 * Function to rotate the camera to the left.
	 */
	smoothLeftRotation() {
		angleX -= 0.01;
		updateCamera = true;
	}

	/**
	 * Function to rotate the camera to the right.
	 */
	smoothRightRotation() {
		angleX += 0.01;
		updateCamera = true;
	}

	/**
	 * Function to move the camera to the original position.
	 */
	smoothReset() {
		if (angleX > degToRad(180)) angleX -= 0.01;
		if (angleX < degToRad(180)) angleX += 0.01;
		if (angleY > degToRad(45)) angleY -= 0.01;
		if (angleY < degToRad(45)) angleY += 0.01;
	}

	/**
	 * Function to reset the camera to the original position.
	 */
	resetCamera() {
		updateCamera = true;
		this.smoothReset();
		if (angleX > degToRad(179) && angleX < degToRad(181)) angleX = degToRad(180);
		if (angleY > degToRad(44) && angleY < degToRad(46)) angleY = degToRad(45);
		if (angleX == degToRad(180) && angleY == degToRad(45)) isResetCamera = false;
	}

	/**
	 * Function to move the camera.
	 */
	moveCamera() {
		if (isResetCamera) this.resetCamera();
		if (zoomIn) this.smoothZoomIn();
		if (zoomOut) this.smoothZoomOut();
		if (leftRotation) this.smoothLeftRotation();
		if (rightRotation) this.smoothRightRotation();
		if (this.cameraControlsEnabled & updateCamera) {
			// Compute the camera's new position.
			this.position[0] = radius * Math.cos(angleY) * Math.cos(angleX);
			this.position[1] = radius * Math.cos(angleY) * Math.sin(angleX);
			this.position[2] = radius * Math.sin(angleY);
		}
		updateCamera = false;
	}

	/**
	 * Compute the camera's matrix using look at.
	 */
	cameraMatrix() {
		return m4.lookAt(this.position, this.target, this.up);
	}

	/**
	 * Make a view matrix from the camera matrix.
	 */
	viewMatrix() {
		return m4.inverse(this.cameraMatrix());
	}

	/**
	 * Compute the projection matrix
	 * 
	 * @param {WebGLRenderingContext} gl WebGL context.
	 */
	projectionMatrix(gl) {
		let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		return m4.perspective(this.fieldOfView, aspect, 1, 2000);
	}
}

/**
 * Sets the camera controls for the canvas.
 * 
 * @param {HTMLCanvasElement} canvas Canvas element to add event listeners to.
 */
export function setCameraControls(canvas) {
	// Button camera controls for mouse and touch.
	document.getElementById("zoomCameraArrowUp").addEventListener("touchstart", function () {
		zoomIn = true;
		updateCamera = true;
	});
	document.getElementById("zoomCameraArrowUp").addEventListener("touchend", function () {
		zoomIn = false;
		updateCamera = false;
	});
	document.getElementById("zoomCameraArrowDown").addEventListener("touchstart", function () {
		zoomOut = true;
		updateCamera = true;
	});
	document.getElementById("zoomCameraArrowDown").addEventListener("touchend", function () {
		zoomOut = false;
		updateCamera = false;
	});
	document.getElementById("rotateLeftCamera").addEventListener("touchstart", function () {
		leftRotation = true;
		updateCamera = true;
	});
	document.getElementById("rotateLeftCamera").addEventListener("touchend", function () {
		leftRotation = false;
		updateCamera = false;
	});
	document.getElementById("rotateRightCamera").addEventListener("touchstart", function () {
		rightRotation = true;
		updateCamera = true;
	});
	document.getElementById("rotateRightCamera").addEventListener("touchend", function () {
		rightRotation = false;
		updateCamera = false;
	});
	document.getElementById("zoomCameraArrowUp").addEventListener("mousedown", function () {
		zoomIn = true;
		updateCamera = true;
	});
	document.getElementById("zoomCameraArrowUp").addEventListener("mouseup", function () {
		zoomIn = false;
		updateCamera = false;
	});
	document.getElementById("zoomCameraArrowDown").addEventListener("mousedown", function () {
		zoomOut = true;
		updateCamera = true;
	});
	document.getElementById("zoomCameraArrowDown").addEventListener("mouseup", function () {
		zoomOut = false;
		updateCamera = false;
	});
	document.getElementById("rotateLeftCamera").addEventListener("mousedown", function () {
		leftRotation = true;
		updateCamera = true;
	});
	document.getElementById("rotateLeftCamera").addEventListener("mouseup", function () {
		leftRotation = false;
		updateCamera = false;
	});
	document.getElementById("rotateRightCamera").addEventListener("mousedown", function () {
		rightRotation = true;
		updateCamera = true;
	});
	document.getElementById("rotateRightCamera").addEventListener("mouseup", function () {
		rightRotation = false;
		updateCamera = false;
	});

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

	// Touch camera controls.
	canvas.addEventListener("touchstart", function (event) {
		event.preventDefault();
		drag = true;
		oldX = event.touches[0].pageX;
		oldY = event.touches[0].pageY;
		return false;
	}
	);
	canvas.addEventListener("touchend", function (event) {
		zoomIn = false;
		zoomOut = false;
		drag = false;
	});
	canvas.addEventListener("touchmove", function (event) {
		if (!drag) return false;
		deltaY = (-(event.touches[0].pageY - oldY) * 2 * Math.PI) / canvas.height;
		deltaX = (-(event.touches[0].pageX - oldX) * 2 * Math.PI) / canvas.width;
		angleX += deltaX;
		angleY -= deltaY;
		if (angleY > degToRad(75)) angleY = degToRad(75);
		if (angleY < degToRad(25)) angleY = degToRad(25);
		oldY = event.touches[0].pageY;
		oldX = event.touches[0].pageX;
		updateCamera = true;
	}
	);

	// Touch zoom in and out camera with pinch-to-zoom.
	canvas.addEventListener("touchstart", function (event) {
		if (event.touches.length == 2) {
			event.preventDefault();
			// Calculate the distance between the two touches.
			var dx = event.touches[0].pageX - event.touches[1].pageX;
			var dy = event.touches[0].pageY - event.touches[1].pageY;
			var distance = Math.sqrt(dx * dx + dy * dy);
			// Store the distance for the next move event.
			lastDistance = distance;
		}
	}
	);
	canvas.addEventListener("touchmove", function (event) {
		// If there are two touches on the screen, check for pinch gestures.
		if (event.touches.length == 2) {
			// Calculate the distance between the two touches.
			var dx = event.touches[0].pageX - event.touches[1].pageX;
			var dy = event.touches[0].pageY - event.touches[1].pageY;
			var distance = Math.sqrt(dx * dx + dy * dy);

			// Check if the distance has increased or decreased.
			if (distance > lastDistance) {
				zoomIn = true;
				zoomOut = false;
			} else if (distance < lastDistance) {
				zoomIn = false;
				zoomOut = true;
			}

			// Update the last distance.
			lastDistance = distance;
		}
	}
	);
}

/**
 * Convert degrees to radians.
 *
 * @param {number} d The number of degrees.
 * 
 * @return {number} The number of radians.
 */
function degToRad(d) {
	return (d * Math.PI) / 180;
}