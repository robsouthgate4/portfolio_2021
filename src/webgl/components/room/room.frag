precision highp float;


uniform sampler2D map;
uniform sampler2D textureColour;
uniform vec3 projPosition;

varying vec2 vUv;
varying vec4 vProjectorTexCoords;
varying vec3 vNormal;
varying vec4 vWorldPosition;


float when_gt(float x, float y) {
  return max(sign(x - y), 0.0);
}

float when_lt(float x, float y) {
  return max(sign(y - x), 0.0);
}

void main() {

	vec2 uv = ( vProjectorTexCoords.xy / vProjectorTexCoords.w ) * 0.5 + 0.5;

	vec4 projectionTexture = texture2D( textureColour, uv );

	vec3  projectorDirection = normalize( projPosition - vWorldPosition.xyz );
	float dotProduct         = dot( vNormal, projectorDirection );

	vec4 colour;
	vec3 baseColour		  =	texture2D( map, vUv ).rgb * 3.0;
	vec3 projectionColour = projectionTexture.rgb;

	float a = 1.0;

	a *= smoothstep( 0.0, 0.2, uv.x );

	a *= smoothstep( 0.0, 0.2, 1.0 - uv.x );
	
	a *= smoothstep( 0.0, 0.2, uv.y );

	a *= smoothstep( 0.0, 0.2, 1.0 - uv.y );	

	projectionColour *= a;

	projectionColour *= clamp( when_gt( dotProduct, 0.0 ) + 0.2, 0.0, 1.0 );

	gl_FragColor = vec4( baseColour + ( projectionColour * 0.7 ), 1.0 );

}