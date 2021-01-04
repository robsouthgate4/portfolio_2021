#pragma glslify: curlNoise = require(glsl-curl-noise)

precision highp float;

attribute vec3  position;
attribute vec3  normal;
attribute vec3 	offset;
attribute vec2  uv;
attribute float instanceId;
attribute vec3  colour;
attribute float scaleY;

uniform mat4 	modelViewMatrix;
uniform mat4 	modelMatrix;
uniform mat4 	projectionMatrix;
uniform mat4 	viewMatrix;

uniform mat4 	viewMatrixCamera;
uniform mat4 	projectionMatrixCamera;
uniform mat4 	modelMatrixCamera;

uniform float 	time;
uniform float 	tHeight;
uniform float 	tWidth;

uniform vec2 		cameraInfo; // x = near, y = far
uniform vec3 		cameraPosition;
uniform sampler2D 	texturePosition;
uniform sampler2D	textureColour;

varying vec3 	vViewPosition;
varying vec3 	vNormal;
varying vec2 	vUv;
varying vec2 	vPosUV;
varying vec3 	vPos;
varying vec3 	vColour;
varying vec3 	vEye;
varying float 	vFogFactor;
varying vec4 	vImageColour;
varying vec4	vProjectorTexCoords;
varying vec4 	vWorldPosition;

float parabola( float x, float k )
{
	
    return pow( 4.0*x*(1.0-x), k );

}

void main() {

	float linearDepth = 1.0 / ( cameraInfo.y - cameraInfo.x );

	vec2 instanceUv;
	
	instanceUv.x = mod( instanceId, tWidth ) / tWidth;
	instanceUv.y = float( instanceId / tHeight ) / tHeight;

	//vec4 ripplePos  	= texture2D( texturePosition, instanceUv );

	vec4 imageColour 	= texture2D( textureColour, instanceUv );

	vec3 transformed = position + ( offset * 1.0 );

	vec3 noise = curlNoise( vec3( instanceId ) + ( ( time * 0.1 ) + instanceId ) );

	//transformed += noise * 1.0;

	vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );

	vEye	= normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );

	gl_Position = projectionMatrix * viewMatrix * worldPosition;

	vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0);

	vViewPosition = -mvPosition.xyz;

	float fogStart = 0.007;
	float fogEnd   = 0.008;

	float linearPos = length( cameraPosition - worldPosition.xyz ) * linearDepth;
    vFogFactor      = clamp( ( fogEnd - linearPos ) / ( fogEnd - fogStart ), 0.0, 1.0 );

	vUv            = uv;
	vPos           = transformed.xyz;
	vColour        = colour;
	vNormal        = normal;
	vImageColour   = imageColour;
	vWorldPosition = worldPosition;

	vProjectorTexCoords = projectionMatrixCamera * viewMatrixCamera * vWorldPosition;

}