let drag;
let THETA = degToRad(50),
	PHI = degToRad(30);
let old_x, old_y;
let dX, dY;

function degToRad(d) {
	return (d * Math.PI) / 180;
}

export function getDrag() {
	return drag;
}

export function setControls(canvas, delta) {
	window.addEventListener("keydown", onKeyDown, true);

	canvas.onmousedown = function (e) {
		drag = true;
		old_x = e.pageX;
		old_y = e.pageY;
		e.preventDefault();
		return false;
	};

	canvas.onmouseup = function (e) {
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
		// console.log(THETA, PHI);
	};

	function onKeyDown(e) {
		// + = 187, - = 189
		if (e.keyCode === 87) {
			// W
			delta.y += 0.05;
			console.log("W");
		}
		if (e.keyCode === 83) {
			// S
			delta.y -= 0.05;
			console.log("S");
		}
		if (e.keyCode === 65) {
			// A
			delta.x += 0.05;
			console.log("A");
		}
		if (e.keyCode === 68) {
			// D
			delta.x -= 0.05;
			console.log("D");
		}
		console.log("Rilevato un movimento del centro dell'oggetto");
		console.log(delta);
	}
}
