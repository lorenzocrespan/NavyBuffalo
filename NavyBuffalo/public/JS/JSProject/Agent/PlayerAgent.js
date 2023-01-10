import { arenaSide, originSpeed } from "../ControlPanel.js";
import { setActive } from "../ControlPanel.js"

let zMovement, xMovement;

export class PlayerListener {
	constructor() {
		this.movement = { x: 0, z: 0 };
		zMovement = 0;
		xMovement = 0;
	}

	updateVector(position) {
		if (
			(position.x > arenaSide && zMovement > 0) ||
			(position.x < -arenaSide && zMovement < 0)
		) {
			zMovement = 0;
		}
		if (
			(position.z > arenaSide && xMovement > 0) ||
			(position.z < -arenaSide && xMovement < 0)
		) {
			xMovement = 0;
		}
		this.movement.x = zMovement;
		this.movement.z = xMovement;
	}

	resetData() {
		zMovement = 0;
		xMovement = 0;
	}

	resetVector() {
		this.movement.x = 0;
		this.movement.z = 0;
	}
}

export function setPlayerControls() {

	// Add button listener for the player
	document.getElementById("movePlayerW").addEventListener("click", function () {
		setActive(true);
		xMovement = 1;
	});
	document.getElementById("movePlayerS").addEventListener("click", function () {
		setActive(true);
		xMovement = -1;
	});
	document.getElementById("movePlayerA").addEventListener("click", function () {
		setActive(true);
		zMovement = 1;
	});
	document.getElementById("movePlayerD").addEventListener("click", function () {
		setActive(true);
		zMovement = -1;
	});


	window.addEventListener("keydown", function (event) {
		setActive(true);
		// Change angle's movement for the player
		switch (event.key) {
			case "w":
				xMovement = 1;
				break;
			case "s":
				xMovement = -1;
				break;
			case "a":
				zMovement = 1;
				break;
			case "d":
				zMovement = -1;
				break;
		}
	});
}
