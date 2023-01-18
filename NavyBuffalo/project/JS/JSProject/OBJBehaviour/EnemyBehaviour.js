import { ObjectBehaviour } from "./ObjectBehaviour.js";
import {
	light,
	lightPosition,
	originSpeed,
	minSpeed,
	maxSpeed
} from "../ControlPanel.js";

let blinkState = false;
let timeUsed = -1;
let spawnTime = 5;

export class EnemyBehaviour extends ObjectBehaviour {

	constructor(alias, mesh, offsets) {
		super(alias, mesh, offsets);
		this.speed = originSpeed;
		this.angle = Math.random() * 2 * Math.PI;
		this.vector = {
			x: Math.cos(this.angle),
			z: Math.sin(this.angle),
		};
		this.isSpawning = false;
		this.isVisible = false;
	}

	/**
	 * Update enemy direction based on enemy collision.
	 */
	changeDirection(vectorX, vectorZ) {
		this.vector.x = vectorX;
		this.vector.z = vectorZ;
	}

	/**
	 * Update enemy mesh position based on enemy movement.
	 */
	computeEnemyPosition() {
		let updatePositionFactorX = this.vector.x * this.speed;
		let updatePositionFactorZ = this.vector.z * this.speed;
		for (let i = 0; i < this.mesh.positions.length; i += 3) {
			this.mesh.positions[i + 1] += updatePositionFactorX;
			this.mesh.positions[i] += updatePositionFactorZ;
		}
		this.position.x += updatePositionFactorX;
		this.position.z += updatePositionFactorZ;
	}

	/**
	 * Increase speed of enemy.
	 */
	increaseSpeed() {
		if (this.speed < maxSpeed) this.speed += 0.01;
	}

	/**
	 * Decrease speed of enemy.
	 */
	decreaseSpeed() {
		if (this.speed > minSpeed) this.speed -= 0.01;
	}

	/**
	 * Reset enemy data.
	 */
	resetData() {
		this.speed = originSpeed;
		this.isSpawning = false;
		this.isVisible = false;
	}

	/**
	 * Render function for enemy.
	 * 
	 * @param {number} time Time of program
	 * @param {WebGLRenderingContext} gl Context for rendering
	 * @param {WebGLProgram} program  Program for rendering
	 * @param {Camera} camera Camera object for rendering
	 * @param {boolean} isScreen Main screen or side screen identifier
	 *
	 */
	render(time, gl, program, camera, isScreen) {
		let positionLocation = gl.getAttribLocation(program, "a_position");
		let normalLocation = gl.getAttribLocation(program, "a_normal");
		let texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
		this.positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.positions), gl.STATIC_DRAW);
		this.normalsBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.normals), gl.STATIC_DRAW);
		this.texcoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.texcoords), gl.STATIC_DRAW);
		gl.uniform3fv(gl.getUniformLocation(program, "diffuse"), this.mesh.diffuse);
		gl.uniform3fv(gl.getUniformLocation(program, "ambient"), this.mesh.ambient);
		gl.uniform3fv(gl.getUniformLocation(program, "specular"), this.mesh.specular);
		gl.uniform3fv(gl.getUniformLocation(program, "emissive"), this.mesh.emissive);
		gl.uniform3fv(gl.getUniformLocation(program, "u_ambientLight"), light.ambientLight);
		gl.uniform3fv(gl.getUniformLocation(program, "u_colorLight"), light.colorLight);
		gl.uniform1f(gl.getUniformLocation(program, "shininess"), this.mesh.shininess);
		gl.uniform1f(gl.getUniformLocation(program, "opacity"), this.mesh.opacity);
		if (this.isVisible) gl.uniform1f(gl.getUniformLocation(program, "uAlpha"), 1);
		else {
			if (blinkState) gl.uniform1f(gl.getUniformLocation(program, "uAlpha"), 1);
			else gl.uniform1f(gl.getUniformLocation(program, "uAlpha"), 0.5);
		}
		// Blinking effect for 5 seconds
		if (this.isSpawning && isScreen) {
			if (spawnTime > 0 && Math.floor(time) % 1 == 0 && Math.floor(time) != timeUsed) {
				blinkState = !blinkState;
				spawnTime -= 0.5;
				timeUsed = Math.floor(time);
			}
			if (spawnTime <= 0) {
				gl.uniform1f(gl.getUniformLocation(program, "uAlpha"), 1);
				this.isSpawning = false;
				this.isVisible = true;
				spawnTime = 5;
			}
		}
		gl.enableVertexAttribArray(positionLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		const size = 3;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
		gl.enableVertexAttribArray(normalLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
		gl.vertexAttribPointer(normalLocation, size, type, normalize, stride, offset);
		gl.enableVertexAttribArray(texcoordLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
		gl.vertexAttribPointer(texcoordLocation, size - 1, type, normalize, stride, offset);
		let matrixLocation = gl.getUniformLocation(program, "u_world");
		let textureLocation = gl.getUniformLocation(program, "diffuseMap");
		let viewMatrixLocation = gl.getUniformLocation(program, "u_view");
		let projectionMatrixLocation = gl.getUniformLocation(program, "u_projection");
		let lightWorldDirectionLocation = gl.getUniformLocation(program, "u_lightDirection");
		let viewWorldPositionLocation = gl.getUniformLocation(program, "u_viewWorldPosition");
		gl.uniformMatrix4fv(viewMatrixLocation, false, camera.viewMatrix());
		gl.uniformMatrix4fv(projectionMatrixLocation, false, camera.projectionMatrix(gl));
		// set the light position
		gl.uniform3fv(lightWorldDirectionLocation, m4.normalize(lightPosition));
		// set the camera/view position
		gl.uniform3fv(viewWorldPositionLocation, camera.position);
		// Tell the shader to use texture unit 0 for diffuseMap
		gl.uniform1i(textureLocation, 0);
		let vertNumber = this.mesh.numVertices;
		drawScene(this.mesh);
		// Draw the scene.
		function drawScene(mesh) {
			if (isScreen) gl.bindTexture(gl.TEXTURE_2D, mesh.mainTexture);
			else gl.bindTexture(gl.TEXTURE_2D, mesh.sideTexture);

			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
			let matrix = m4.identity();
			gl.uniformMatrix4fv(matrixLocation, false, matrix);
			gl.drawArrays(gl.TRIANGLES, 0, vertNumber);
		}
	}
}
