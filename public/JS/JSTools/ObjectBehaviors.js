import { PlayerController } from "./PlayerController.js";

export class ObjectBehaviors {
	constructor(alias, mesh, isActive, isPlayer, offsets) {
		this.alias = alias;
		this.mesh = mesh;
		this.isActive = isActive;
		this.position = { x: offsets.x, y: offsets.y, z: offsets.z };
		this.isPlayer = isPlayer;

		this.compute_position();
		console.log("AAAAAA");
		console.debug(this);
	}

	compute_position() {
		for (let i = 0; i < this.mesh.positions.length; i += 3) {
			this.mesh.positions[i] += parseFloat(this.position.z);
			this.mesh.positions[i + 1] += parseFloat(this.position.x);
			this.mesh.positions[i + 2] += parseFloat(this.position.y);
		}
	}

	compute_new_position(delta) {
		for (let i = 0; i < this.mesh.positions.length; i += 3) {
			this.mesh.positions[i] += delta.z;
			this.mesh.positions[i + 1] += delta.x;
			this.mesh.positions[i + 2] += delta.y;
		}
	}

	render(gl, light, program, tar, delta) {
		this.compute_new_position(delta);
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
		let fieldOfViewRadians = degToRad(30);

		// Compute the projection matrix
		let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		//  zmin=0.125;
		let zmin = 0.1;
		let projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zmin, 10);

		let cameraPosition = [9, -4, 4];
		let up = [0, 0, 1];

		// Compute the camera's matrix using look at.
		let cameraMatrix = m4.lookAt(cameraPosition, tar, up);

		// Make a view matrix from the camera matrix.
		let viewMatrix = m4.inverse(cameraMatrix);

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

		gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
		gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

		// set the light position
		gl.uniform3fv(lightWorldDirectionLocation, m4.normalize([-1, 3, 5]));

		// set the camera/view position
		gl.uniform3fv(viewWorldPositionLocation, cameraPosition);

		// Tell the shader to use texture unit 0 for diffuseMap
		gl.uniform1i(textureLocation, 0);

		function degToRad(d) {
			return (d * Math.PI) / 180;
		}
		let vertNumber = this.mesh.numVertices;
		drawScene(0);
		// Draw the scene.
		function drawScene(time) {
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
			gl.enable(gl.CULL_FACE);
			gl.enable(gl.DEPTH_TEST);
			let matrix = m4.identity();
			gl.uniformMatrix4fv(matrixLocation, false, matrix);
			gl.drawArrays(gl.TRIANGLES, 0, vertNumber);
		}
	}
}
