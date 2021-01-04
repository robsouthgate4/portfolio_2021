#pragma glslify: curlNoise = require(glsl-curl-noise)

precision highp float;

uniform float 		time;
uniform float 	    power;
uniform float		dampen;
uniform float		speed;
uniform float 		brushSize;
uniform vec2        mouse;
uniform sampler2D   textureOrigin;
uniform sampler2D   texturePreviousPosition;

#define PI 3.14159265359


// Samples velocity from neighbor
float getSpring( float height, vec2 position, float factor ) 
{

  return ( texture2D( texturePosition, position ).r - height ) * factor;

}

void main () {

	  vec2 id					= gl_FragCoord.xy / resolution.xy;

    vec2 kernel = ( vec2( 1.0 ) / resolution ) * speed;
    
    vec4  color  = texture2D( texturePosition, id );

    float sdf = distance( id, vec2( mouse.x, mouse.y ) );
    sdf       = 1.0 - step( brushSize, sdf );    

    float height = color.r;
    float vel    = color.g;

    vel += getSpring( height, id + kernel * vec2( 2.0, 3.0 ), 0.0022411859348636983 * power );
    vel += getSpring( height, id + kernel * vec2( 0.0, 3.0 ), 0.0056818181818181820 * power );
    vel += getSpring( height, id + kernel * vec2( -2.0, 3.0 ), 0.0022411859348636983 * power );
    vel += getSpring( height, id + kernel * vec2( 2.0, 2.0 ), 0.0066566640639421000 * power );
    vel += getSpring( height, id + kernel * vec2( 0.0, 2.0 ), 0.0113636363636363640 * power );
    vel += getSpring( height, id + kernel * vec2( -2.0, 2.0 ), 0.0066566640639421000 * power );
    vel += getSpring( height, id + kernel * vec2( 3.0, 1.0 ), 0.0047597860217705710 * power );
    vel += getSpring( height, id + kernel * vec2( 1.0, 1.0 ), 0.0146919683956074150 * power );
    vel += getSpring( height, id + kernel * vec2( -1.0, 1.0 ), 0.0146919683956074150 * power );
    vel += getSpring( height, id + kernel * vec2( -3.0, 1.0 ), 0.0047597860217705710 * power );
    vel += getSpring( height, id + kernel * vec2( 2.0, 0.0 ), 0.0113636363636363640 * power );
    vel += getSpring( height, id + kernel * vec2( -2.0, 0.0 ), 0.0113636363636363640 * power );
    vel += getSpring( height, id + kernel * vec2( 3.0, -1.0 ), 0.0047597860217705710 * power );
    vel += getSpring( height, id + kernel * vec2( 1.0, -1.0 ), 0.0146919683956074150 * power );
    vel += getSpring( height, id + kernel * vec2( -1.0, -1.0 ), 0.0146919683956074150 * power );
    vel += getSpring( height, id + kernel * vec2( -3.0, -1.0 ), 0.0047597860217705710 * power );
    vel += getSpring( height, id + kernel * vec2( 2.0, -2.0 ), 0.0066566640639421000 * power );
    vel += getSpring( height, id + kernel * vec2( 0.0, -2.0 ), 0.0113636363636363640 * power );
    vel += getSpring( height, id + kernel * vec2( -2.0, -2.0 ), 0.0066566640639421000 * power );
    vel += getSpring( height, id + kernel * vec2( 2.0, -3.0 ), 0.0022411859348636983 * power );
    vel += getSpring( height, id + kernel * vec2( 0.0, -3.0 ), 0.0056818181818181820 * power );
    vel += getSpring( height, id + kernel * vec2( -2.0, -3.0 ), 0.0022411859348636983 * power );

	  height += vel;
 
    // Reduce the velocity

    vel *= dampen;

    height += sdf;

    height *= 0.99;

    // Store the height and velocity in the red and green channels
    gl_FragColor = vec4( clamp( height, 0., 1.0 ), vel, 0.0, 1.0 );

    //gl_FragColor = vec4( vec3( sdf ), 1.0 );

	

}