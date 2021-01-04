

import { Color, DoubleSide, RawShaderMaterial, TextureLoader } from "three";

const createMSDFShader = require( "Common/libs/three-bmfont-text/shaders/msdf.js" );

export default class MSDFMaterial extends RawShaderMaterial {

	constructor( { texture } ) {

		super( createMSDFShader( { 

			map: 			texture,
			color: 			new Color( 0xffffff ),
			side: 			DoubleSide,
			transparent: 	true,
			negate: 		false

		} ) );

		this.extensions.derivatives = true;

	}

}
