var angle;
// Definizione della classe "Camera".
// A suo interno vi è la completa gestione delle caratteristiche relative
// alla camera.
export class Camera {
	// Costruttore della classe "Camera".
	// position,
	// up
	// target
	// nPlanets
	// radius
	// fieldOfView
	constructor(position, up, target, nPlanets, radius, fieldOfView) {
		this.position = position;
		this.up = up;
		this.target = target;
		this.nPlanets = nPlanets;
		this.radius = radius;
		this.fieldOfView = fieldOfView;
		angle = 0;
	}

	zoom(offset) {
		this.position[2] += offset;
	}

	moveCamera() {
		console.log("Ricalcolo posizione camera");
		console.log(angle);
		const radius = 5;
		angle += this.degToRad(1);
		this.position[0] = Math.cos(angle) * radius;
		this.position[1] = Math.sin(angle) * radius;
	}

	// Compute the camera's matrix using look at.
	cameraMatrix() {
		return m4.lookAt(this.position, this.target, this.up);
	}

	cameraMatrix2() {
		return m4.translate(
			m4.yRotation(this.degToRad(70)),
			0,
			0,
			this.radius * 1.5
		);
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

	// Compute a view projection matrix
	viewProjectionMatrix(gl) {
		return m4.multiply(this.projectionMatrix(gl), this.viewMatrix());
	}

	matrixLocation(gl, program) {
		return gl.getUniformLocation(program, "u_world");
	}

	computeMatrix(viewProj, translation, rotX, rotY) {
		let matrix = m4.translate(
			viewProj,
			translation[0],
			translation[1],
			translation[2]
		);
		matrix = m4.xRotate(matrix, rotX);
		return m4.yRotate(matrix, rotY);
	}

	uniform(gl, program) {
		for (let i = 0; i < this.nPlanets; i++) {
			let angle = (i * Math.PI * 2) / this.nPlanets;
			let x = Math.cos(angle) * this.radius;
			let y = Math.sin(angle) * this.radius;

			// starting with the view projection matrix compute a matrix for the F
			let matrix = m4.translate(this.viewProjectionMatrix(gl), x, 0, y);

			// Set the matrix.
			gl.uniformMatrix4fv(this.matrixLocation(gl, program), false, matrix);
		}
	}

	degToRad(d) {
		return (d * Math.PI) / 180;
	}
}
