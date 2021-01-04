#extension GL_OES_standard_derivatives : enable
precision highp float;

varying vec3 	vNormal;
varying vec2 	vUv;
varying vec3 	vColour;
varying vec3 	vDirection;
varying vec3 	vPos;
varying vec3 	vEye;
varying float 	vLife;
varying float 	vFogFactor;
varying float 	vRippleValue;
varying vec4 	vImageColour;
varying vec4	vProjectorTexCoords;
varying vec4 	vWorldPosition;

uniform sampler2D matcap;
uniform sampler2D textureColour;
uniform vec3 projPosition;

float when_gt(float x, float y) {
  return max(sign(x - y), 0.0);
}

float when_lt(float x, float y) {
  return max(sign(y - x), 0.0);
}


void main () {

	vec2 uv = ( vProjectorTexCoords.xy / vProjectorTexCoords.w ) * 0.5 + 0.5;

	vec4 projectionTexture = texture2D( textureColour, uv );

	vec3  projectorDirection = normalize( projPosition - vWorldPosition.xyz );
	float dotProduct         = dot( vNormal, projectorDirection );


  	vec3 normal = vNormal;

	vec3 r 	= reflect( vEye, normal );
  	float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
  	vec2 vN = r.xy / m + .5;

	vec3 matcapColour = texture2D( matcap, vN ).rgb;

	float diffuse = normal.y * 0.5 + 0.5;

	vec3 colour =  vec3( 1.0 );

	//colour.b += 0.1;	
	//colour.g += 0.02;	

	vec3 fogColor = vec3( 0.0 );

	//colour = vImageColour.rgb;

	//colour.r += pow( vPos.y, 6.0 );
	//colour *= 0.68;

	//colour.rgb -= ( 0.5 * vRippleValue );

	

	colour = projectionTexture.rgb;

	float dist = distance( uv, vec2( 0.5 ) );

	float a = 1.0;

	a *= when_gt( uv.x, 0.0 );
	a *= when_lt( uv.x, 1.0 );
	a *= when_gt( uv.y, 0.0 );
	a *= when_lt( uv.y, 1.0 );

	colour = mix( vec3( 0.2 ), colour, a );

	colour *= clamp( when_gt( dotProduct, 0.0 ) + 0.2, 0.0, 1.0 );

	//colour = mix( fogColor, colour, vFogFactor );

	gl_FragColor = vec4( colour, 1.0 );

}