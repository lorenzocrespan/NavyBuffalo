import { ObjectBehaviour } from "./ObjectBehaviour.js";
import {
	light,
	lightPosition
} from "../ControlPanel.js";

export class PointBehaviour extends ObjectBehaviour {
	constructor(alias, mesh, offsets) {
		super(alias, mesh, offsets);
		this.originalPosition = {
			x: offsets.x,
			y: offsets.y,
			z: offsets.z,
		};
		this.ampWaveLimiter = 0.004;
		let rotMatY = m4.yRotation(0.04);
		this.rotMat = rotMatY;
		// let rotMatX = m4.xRotation(0.01);
		// this.rotMat = m4.multiply(rotMatX, rotMatY);
		this.offdeltaY = 0;
	}

	changePosition() {
		// Math.random() * (max - min) + min
		let newX = Math.floor(Math.random() * 14 - 7);
		let newZ = Math.floor(Math.random() * 14 - 7);
		let deltaX = newX - this.position.x;
		let deltaZ = newZ - this.position.z;
		for (let i = 0; i < this.mesh.positions.length; i += 3) {
			this.mesh.positions[i + 1] += deltaX;
			this.mesh.positions[i] += deltaZ;
		}
		this.position.x = newX;
		this.position.z = newZ;
	}

	// Calcolo della nuova posizione della mesh (mesh.positions e mesh.normals).
	computeIdleAnimation(time) {

		this.offdeltaY = Math.sin(time) * this.ampWaveLimiter;
		for (let i = 0; i < this.mesh.positions.length; i += 3) {
			var pos = [];
			var nor = [];

			this.mesh.positions[i + 2] += Math.sin(time) * this.ampWaveLimiter;

			pos.push(this.mesh.positions[i + 1] - this.position.x);
			pos.push(this.mesh.positions[i + 2] - 1 - this.position.y);
			pos.push(this.mesh.positions[i] - this.position.z);

			nor.push(this.mesh.normals[i + 1]);
			nor.push(this.mesh.normals[i + 2]);
			nor.push(this.mesh.normals[i]);

			var pos_res = m4.transformPoint(this.rotMat, pos);
			var nor_res = m4.transformPoint(this.rotMat, nor);

			this.mesh.positions[i + 1] = pos_res[0] + this.position.x;
			this.mesh.positions[i + 2] = pos_res[1] + 1 + this.position.y;
			this.mesh.positions[i] = pos_res[2] + this.position.z;

			this.mesh.normals[i + 1] = nor_res[0];
			this.mesh.normals[i + 2] = nor_res[1];
			this.mesh.normals[i] = nor_res[2];
		}
	}

	render(gl, program, camera, isScreen) {
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
		gl.uniform3fv(lightWorldDirectionLocation, m4.normalize(lightPosition));

		// set the camera/view position
		gl.uniform3fv(viewWorldPositionLocation, camera.position);

		// Tell the shader to use texture unit 0 for diffuseMap
		gl.uniform1i(textureLocation, 0);

		let vertNumber = this.mesh.numVertices;
		drawScene(0, this.mesh);

		// Draw the scene.
		function drawScene(time, mesh) {
			if (isScreen) gl.bindTexture(gl.TEXTURE_2D, mesh.mainTexture);
			else gl.bindTexture(gl.TEXTURE_2D, mesh.sideTexture);

			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

			let matrix = m4.identity();
			gl.uniformMatrix4fv(matrixLocation, false, matrix);

			gl.drawArrays(gl.TRIANGLES, 0, vertNumber);
		}
	}

}
