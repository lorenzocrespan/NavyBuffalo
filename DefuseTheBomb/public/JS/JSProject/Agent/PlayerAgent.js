import { arenaSide, originSpeed } from "../ControlPanel.js";
import {setActive} from "../ControlPanel.js"

let deltaX, deltaZ;
let speed;

export class PlayerListener {
	constructor() {
		this.delta = { x: 0, z: 0 };
		deltaX = 0;
		deltaZ = 0;
		speed = originSpeed;
	}

	updateVector(position) {
		if (
			(position.x > arenaSide && deltaX > 0) ||
			(position.x < -arenaSide && deltaX < 0)
		) {
			deltaX = 0;
		}
		if (
			(position.z > arenaSide && deltaZ > 0) ||
			(position.z < -arenaSide && deltaZ < 0)
		) {
			deltaZ = 0;
		}
		this.delta.x = deltaX;
		this.delta.z = deltaZ;
	}

	buffSpeed() {
		speed += 0.01;
	}

	debuffSpeed() {
		speed -= 0.01;
	}

	resetPosition() {
		deltaX = 0;
		deltaZ = 0;
	}

	resetVector() {
		this.delta.x = 0;
		this.delta.z = 0;
	}
}

export function setPlayerControls(canvas) {

	window.addEventListener("keydown", function (event) {
		setActive(true);
		switch (event.key) {
			case "w":
				deltaZ = speed;
				break;
			case "s":
				deltaZ = -speed;
				break;
			case "a":
				deltaX = speed;
				break;
			case "d":
				deltaX = -speed;
				break;
		}
	});
}
