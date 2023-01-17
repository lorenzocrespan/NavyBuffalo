import {
	getActive,
	light,
	lightPosition,
	originSpeed,
	minSpeed,
	maxSpeed
} from "../ControlPanel.js";
import { ObjectBehaviour } from "./ObjectBehaviour.js";
import { PlayerListener } from "../Agent/PlayerAgent.js";

export class PlayerBehaviour extends ObjectBehaviour {

	constructor(alias, mesh, offsets) {
		super(alias, mesh, offsets);
		this.originalPosition = {
			x: offsets.x,
			z: offsets.z,
		};
		this.speed = originSpeed;
		this.playerListener = new PlayerListener();
	}

	/**
	 * Reset player data.
	 */
	resetData() {
		this.resetMesh();
		this.playerListener.resetData();
		this.playerListener.resetVector();
		this.speed = originSpeed;
		this.position.x = this.originalPosition.x;
		this.position.z = this.originalPosition.z;
	}

	/**
	 * Reset mesh position to original position.
	 * 
	 */
	resetMesh() {
		let deltaX = this.originalPosition.x - this.position.x;
		let deltaZ = this.originalPosition.z - this.position.z;
		for (let i = 0; i < this.mesh.positions.length; i += 3) {
			this.mesh.positions[i + 1] += deltaX;
			this.mesh.positions[i] += deltaZ;
		}
	}

	/**
	 * Update player mesh position based on player movement.
	 */
	computePlayerPosition() {
		let updatePositionFactorX = this.playerListener.movement.x * this.speed;
		let updatePositionFactorZ = this.playerListener.movement.z * this.speed;
		for (let i = 0; i < this.mesh.positions.length; i += 3) {
			this.mesh.positions[i + 1] += updatePositionFactorX;
			this.mesh.positions[i] += updatePositionFactorZ;
		}
		this.position.x += updatePositionFactorX;
		this.position.z += updatePositionFactorZ;
	}
	/**
	 * Increase player speed limited by maxSpeed
	 */
	increaseSpeed() {
		if (this.speed < maxSpeed) this.speed += 0.01;
	}

	/**
	 * Decrease player speed limited by minSpeed
	 */
	decreaseSpeed() {
		if (this.speed > minSpeed) this.speed -= 0.01;
	}

	/**
	 * Render function for player.
	 * 
	 * @param {WebGLRenderingContext} gl Context for rendering
	 * @param {WebGLProgram} program  Program for rendering
	 * @param {Camera} camera Camera object for rendering
	 * @param {boolean} isScreen Main screen or side screen identifier
	 *
	 */
	render(gl, program, camera, isScreen) {
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
		if (!getActive()) gl.uniform1f(gl.getUniformLocation(program, "uAlpha"), 0.4);
		else gl.uniform1f(gl.getUniformLocation(program, "uAlpha"), 1.0);
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
