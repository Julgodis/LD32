attribute vec4 position;
attribute vec4 color;
attribute vec2 texture;
attribute float flip;
attribute vec3 mA;
attribute vec3 mB;
attribute vec3 mC;

uniform mat3 world;

varying vec4 outColor;
varying vec2 outTexture;
varying vec3 outPosition;
varying mediump float outRotation;
varying mediump float outFlip;

void main(void) {
	outColor = color;
	outTexture = texture;
	outFlip = flip;

	mat3 transform = mat3(mA, mB, mC);
	outRotation = position.w;

	outPosition = vec3((transform * vec3(position.xy, 1)).xy, position.z);
	vec2 pos = (world * vec3(outPosition.xy, 1)).xy;
	gl_Position = vec4(pos, 0, 1);
}