import { ObjectBehaviour } from "./ObjectBehaviour.js";
import { light, lightPosition } from "../ControlPanel.js";

let greenRGB = [0, 1, 0];
let redRGB = [1, 0, 0];

export class ModifierBehaviour extends ObjectBehaviour {

	constructor(alias, mesh, offsets) {
		super(alias, mesh, offsets);
		this.isBuffer = 0;
	}

	/**
	 * Update modifier effect (buff or debuff) and change color accordingly.
	 */
	changeColorModifier() {
		this.isBuffer = Math.floor(Math.random() * 2);
		if (this.isBuffer == 0) this.mesh.diffuse = greenRGB;
		else this.mesh.diffuse = redRGB;
	}

	/**
	 * Update modifier mesh position based on modifier new position.
	 */
	changePosition(newPosition) {
		let newX = newPosition.position.x;
		let newZ = newPosition.position.z;
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

	/**
	 * Render function for point.
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
		gl.uniform1f(gl.getUniformLocation(program, "uAlpha"), 0.25);
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
