#define M_PI 3.1415926535897932384626433832795

#pragma glslify: dither = require(../../common/shaders/partials/dither.glsl)

varying vec2 vUv;

uniform vec3 color1;
uniform vec3 color2;

void main () {

	float grad = sin( 1.0 - vUv.y * M_PI ) + dither( 10.0/255.0, vUv );

	vec3 color = mix( color1 * 0.5, color2 * 0.75, grad );

	gl_FragColor = vec4( color, 1.0 );

}