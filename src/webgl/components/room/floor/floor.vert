

precision highp float;

varying vec2 vUv;

varying vec4 	vWorldPosition;
varying vec3 	vNormal;
varying vec4 	vViewPosition;
varying vec4 	vClipSpace;
varying vec2 	vNDC;

void main() {

	vUv = uv;

	vec3 transformed = position;

	vWorldPosition      = modelMatrix * vec4( transformed, 1.0 );

	vClipSpace 			= projectionMatrix * viewMatrix * modelMatrix * vec4( position.x, 0., position.z, 1.0 );

	gl_Position 		= vClipSpace;

	vNormal             = normal;

}