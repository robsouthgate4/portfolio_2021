

precision highp float;

varying vec2 vUv;

uniform mat4 	viewMatrixCamera;
uniform mat4 	projectionMatrixCamera;
uniform mat4 	modelMatrixCamera;

varying vec4 	vProjectorTexCoords;
varying vec4 	vWorldPosition;
varying vec3 	vNormal;

void main() {

	vUv = uv;

	vec3 transformed = position;

	gl_Position =  projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );

	vWorldPosition      = modelMatrix * vec4( transformed, 1.0 );
	vNormal             = normal;
	vProjectorTexCoords = projectionMatrixCamera * viewMatrixCamera * vWorldPosition;

}