import { ObjectBehaviour } from "./ObjectBehaviour.js";

export class EnemyBehaviour extends ObjectBehaviour {
	constructor(alias, mesh, offsets) {
		super(alias, mesh, offsets);
		this.speed = 0.075;
		this.angle = Math.random() * 2 * Math.PI;
		this.vector = {
			x: Math.cos(this.angle),
			z: Math.sin(this.angle),
		};
	}

	changeDirection(vectorX, vectorZ) {
		this.vector.x = vectorX;
		this.vector.z = vectorZ;
	}

	compute_enemy() {
		let updatePositionFactorX = this.vector.x * this.speed;
		let updatePositionFactorZ = this.vector.z * this.speed;
		for (let i = 0; i < this.mesh.positions.length; i += 3) {
			this.mesh.positions[i + 1] += updatePositionFactorX;
			this.mesh.positions[i] += updatePositionFactorZ;
		}
		this.position.x += updatePositionFactorX;
		this.position.z += updatePositionFactorZ;
	}

	increaseSpeed() {
		this.speed += 0.01;
	}

	decreaseSpeed() {
		this.speed -= 0.01;
	}


	render(gl, light, program, camera, isScreen) {
		
		if (isScreen) this.compute_enemy();

		/********************************************************************************************/

		let positionLocation = gl.getAttribLocation(program, "a_position");
		let normalLocation = gl.getAttribLocation(program, "a_normal");
		let texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
		this.positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(this.mesh.positions),
			gl.STATIC_DRAW
		);
		this.normalsBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(this.mesh.normals),
			gl.STATIC_DRAW
		);
		this.texcoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(this.mesh.texcoords),
			gl.STATIC_DRAW
		);
		gl.uniform3fv(gl.getUniformLocation(program, "diffuse"), this.mesh.diffuse);
		gl.uniform3fv(gl.getUniformLocation(program, "ambient"), this.mesh.ambient);
		gl.uniform3fv(
			gl.getUniformLocation(program, "specular"),
			this.mesh.specular
		);
		gl.uniform3fv(
			gl.getUniformLocation(program, "emissive"),
			this.mesh.emissive
		);
		gl.uniform3fv(
			gl.getUniformLocation(program, "u_ambientLight"),
			light.ambientLight
		);
		gl.uniform3fv(
			gl.getUniformLocation(program, "u_colorLight"),
			light.colorLight
		);

		gl.uniform1f(
			gl.getUniformLocation(program, "shininess"),
			this.mesh.shininess
		);
		gl.uniform1f(gl.getUniformLocation(program, "opacity"), this.mesh.opacity);
		gl.enableVertexAttribArray(positionLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		const size = 3; // 3 components per iteration
		const type = gl.FLOAT; // the data is 32bit floats
		const normalize = false; // don't normalize the data
		const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
		const offset = 0; // start at the beginning of the buffer
		gl.vertexAttribPointer(
			positionLocation,
			size,
			type,
			normalize,
			stride,
			offset
		);
		gl.enableVertexAttribArray(normalLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
		gl.vertexAttribPointer(
			normalLocation,
			size,
			type,
			normalize,
			stride,
			offset
		);
		gl.enableVertexAttribArray(texcoordLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
		gl.vertexAttribPointer(
			texcoordLocation,
			size - 1,
			type,
			normalize,
			stride,
			offset
		);

		let matrixLocation = gl.getUniformLocation(program, "u_world");
		let textureLocation = gl.getUniformLocation(program, "diffuseMap");
		let viewMatrixLocation = gl.getUniformLocation(program, "u_view");
		let projectionMatrixLocation = gl.getUniformLocation(
			program,
			"u_projection"
		);
		let lightWorldDirectionLocation = gl.getUniformLocation(
			program,
			"u_lightDirection"
		);
		let viewWorldPositionLocation = gl.getUniformLocation(
			program,
			"u_viewWorldPosition"
		);

		gl.uniformMatrix4fv(viewMatrixLocation, false, camera.viewMatrix());
		gl.uniformMatrix4fv(
			projectionMatrixLocation,
			false,
			camera.projectionMatrix(gl)
		);

		// set the light position
		gl.uniform3fv(lightWorldDirectionLocation, m4.normalize([-1, 3, 7]));

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
