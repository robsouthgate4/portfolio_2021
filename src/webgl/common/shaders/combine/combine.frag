
#pragma glslify: vignette = require(glsl-vignette) 
#pragma glslify: aces = require(glsl-tone-map/aces)
#pragma glslify: uncharted2 = require(glsl-tone-map/uncharted2)
#pragma glslify: lottes = require(glsl-tone-map/lottes)
#pragma glslify: reinhard = require(glsl-tone-map/reinhard)
#pragma glslify: reinhard2 = require(glsl-tone-map/reinhard2)
#pragma glslify: uchimura = require(glsl-tone-map/uchimura)
#pragma glslify: filmic = require(glsl-tone-map/filmic)
#pragma glslify: unreal = require(glsl-tone-map/unreal)


varying vec2 vUv;
uniform sampler2D tDiffuse;

float random( vec2 p )
  {
    vec2 K1 = vec2(
      23.14069263277926, // e^pi (Gelfond's constant)
      2.665144142690225 // 2^sqrt(2) (Gelfondâ€“Schneider constant)
    );
    return fract( cos( dot(p,K1) ) * 12345.6789 );
}

void main() {

    
    float vignetteValue = vignette( vUv, 0.7, 0.6 );

    vec3 diffuse        = texture2D( tDiffuse, vUv ).rgb;

    vec3 color          = diffuse;

    vec2 uvRandom = vUv;

    uvRandom.y   *= random( vec2( uvRandom.y, 1.0 ) );

    color.rgb    += random( uvRandom ) * 0.01;    

    gl_FragColor.rgb    = filmic( color );
    
    gl_FragColor.a      = 1.0;

}