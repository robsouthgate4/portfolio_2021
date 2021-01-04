import { ShaderMaterial, Vector2 } from "three";

import combineVert from "Common/shaders/combine/combine.vert";
import combineFrag from "Common/shaders/combine/combine.frag";

export default class CombineShader extends ShaderMaterial {

	constructor( ) {

		const uniforms = {

			tDiffuse:       { value: null },
			uResolution:    { value: new Vector2( window.innerWidth, window.innerHeight ) }

		};

		super( { 

			vertexShader: 	combineVert, 
			fragmentShader: combineFrag,
			uniforms, 
			depthTest:  	false, 
			depthWrite:		false 
			
		} );

	}

	resize( width, height ) {

		this.uniforms.uResolution.value = new Vector2( width, height );

	}

}