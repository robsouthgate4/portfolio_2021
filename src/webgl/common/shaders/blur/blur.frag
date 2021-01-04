#define M_PI 3.1415926535897932384626433832795

uniform sampler2D 	tDiffuse;
uniform vec2 		uResolution;
uniform vec2 		uStrength;

varying vec2 		vUv;

#pragma glslify: blur = require(../partials/blur9.glsl)

void main()
{
    vec4 diffuseColor 	= texture2D( tDiffuse, vUv );

    vec4 blurColor 		= blur( tDiffuse, vUv, uResolution, uStrength );

    gl_FragColor        = blurColor;

    //gl_FragColor        = vec4( vec3( blurStrength ), 1.0 );
	
}