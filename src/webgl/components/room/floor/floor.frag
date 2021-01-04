

precision highp float;
precision highp int;


uniform sampler2D map;
uniform sampler2D textureColour;
uniform sampler2D reflectionMap;
uniform sampler2D reflectionMapBlurred;
uniform sampler2D tileNormalMap;
uniform sampler2D floorRoughnessMap;

uniform float roughness;
uniform float tileNormalStrength;
uniform vec3 lightColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec4 vWorldPosition;
varying vec4 vClipSpace;



float when_gt(float x, float y) {

	return max(sign(x - y), 0.0);

}

float when_lt(float x, float y) {

	return max(sign(y - x), 0.0);
	
}

void main() {

	

	vec2 ndc              = ( vClipSpace.xy / vClipSpace.w ) / 2.0 + 0.5;	

	vec4 tileNormal		= texture2D( tileNormalMap, vUv * 20. ) * 2.0 - 1.0;
	vec4 floorRoughness = texture2D( floorRoughnessMap, vUv * 5. );

	vec2 reflectTexCoords = vec2( ndc.x, 1.0 - ndc.y );

	reflectTexCoords.xy -= tileNormal.xy * tileNormalStrength;

	vec4 reflectionColour  = texture2D( reflectionMap, reflectTexCoords ) * pow( ndc.y, 1.8 );
	vec4 reflectionBlurred = texture2D( reflectionMapBlurred, reflectTexCoords ) * 2.0 * pow( ndc.y, 1.8 );

	vec3 lightDir = normalize( vec3( 0.0, 10.0, -20. ) - vWorldPosition.xyz );
	float diff = max( dot( mix( vNormal, tileNormal.xyz, 0.0 ), lightDir ), 0.0 );

	vec3 diffuse = diff * lightColor;

	vec4 finalColor = mix( reflectionColour * 2.5, reflectionBlurred * 2.5, roughness );

	//finalColor.rgb += ( diffuse ) * 0.0009;

	gl_FragColor = finalColor;

	//gl_FragColor = floorRoughness;

}