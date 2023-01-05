import { ObjectBehaviour } from "./ObjectBehaviour.js";
import { isTransparencyActive } from "../ControlPanel.js";
let greenRGB = [0, 1, 0];
let redRGB = [1, 0, 0];

export class ModifierBehaviour extends ObjectBehaviour {
	constructor(alias, mesh, offsets) {
		super(alias, mesh, offsets);
		this.originalPosition = {
			x: offsets.x, // Posizione del "centro" dell'OBJ rispetto alla coordinata X
			y: offsets.y, // Posizione del "centro" dell'OBJ rispetto alla coordinata Y
			z: offsets.z, // Posizione del "centro" dell'OBJ rispetto alla coordinata Z
		};
		this.isBuffer = 0;
	}

    changeColorModifier() {
        this.isBuffer = Math.floor(Math.random() * 2);
        if (this.isBuffer == 0) this.mesh.diffuse = greenRGB;
        else this.mesh.diffuse = redRGB;
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
        this.changeColorModifier()
	}

	render(time, gl, light, program, camera, isScreen) {
        
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
        gl.uniform1f(gl.getUniformLocation(program, "uAlpha"), 0.4);
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
		drawScene(0, this.mesh);

		// Draw the scene.
		function drawScene(time, mesh) {
			if (isScreen) gl.bindTexture(gl.TEXTURE_2D, mesh.mainTexture);
			else gl.bindTexture(gl.TEXTURE_2D, mesh.sideTexture);

			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

			if(isTransparencyActive){
				gl.enable(gl.BLEND);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
				gl.enable(gl.DEPTH_TEST);
			} else {
				gl.disable(gl.BLEND);
			}

			let matrix = m4.identity();
			gl.uniformMatrix4fv(matrixLocation, false, matrix);

			gl.drawArrays(gl.TRIANGLES, 0, vertNumber);
		}
	}
	
}
