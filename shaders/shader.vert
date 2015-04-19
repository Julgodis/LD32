attribute vec4 position;
attribute vec4 color;
attribute float flip;
attribute vec3 mA;
attribute vec3 mB;
attribute vec3 mC;

uniform mat3 world;

varying vec4 outColor;
  
void main(void) {
	outColor = color;
	mat3 transform = mat3(mA, mB, mC);
	mat3 mvp = (world * transform);

	gl_Position = vec4((mvp * vec3(position.xy, 1)).xy, 0, 1);
}