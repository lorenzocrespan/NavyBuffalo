let dX = 0,
	dZ = 0;

let speed = 0.075;

export class PlayerListener {
	constructor() {
		this.delta = { x: 0, y: 0, z: 0 };
	}

	updatePosition() {
		this.delta.x = dX;
		this.delta.z = dZ;
	}

	resetPosition() {
		dX = 0;
		dZ = 0;
	}
}

export function setPlayerControls(canvas, delta) {
	window.addEventListener("keydown", onKeyDown, true);

	function onKeyDown(e) {
		if (e.keyCode === 87) {
			// W
			dZ = speed;
		}
		if (e.keyCode === 83) {
			// S
			dZ = -speed;
		}
		if (e.keyCode === 65) {
			// A
			dX = speed;
		}
		if (e.keyCode === 68) {
			// D
			dX = -speed;
		}
	}
}
