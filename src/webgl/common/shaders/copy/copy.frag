
varying vec2 vUv;
uniform sampler2D tDiffuse;

uniform bool flip;

void main() {

    vec2 uv = vUv;

    if( flip == true ) {

        uv.y = 1.0 - uv.y;
    
    }

    vec3 diffuse = texture2D( tDiffuse, uv ).rgb;

    gl_FragColor.rgb = diffuse;
    
    gl_FragColor.a = 1.0;

}