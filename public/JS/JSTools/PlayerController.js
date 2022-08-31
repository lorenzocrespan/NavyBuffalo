let mouseX, mouseY;
const data = new Uint8Array(4);

export function setUserPicking(canvas, gl) {
	gl.canvas.addEventListener("click", (e) => {
		const rect = canvas.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
		gl.readPixels(
			0, // x
			0, // y
			1, // width
			1, // height
			gl.RGBA, // format
			gl.UNSIGNED_BYTE, // type
			data
		);
		const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
		console.log(data);
	});
}
