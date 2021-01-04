import { Color, WebGL1Renderer, WebGLRenderer } from "three";

import Emitter from "Common/Emitter"

class Renderer extends WebGL1Renderer {

	constructor() {

		super();
		
		this.setPixelRatio( window.devicePixelRatio );
		this.setClearColor( new Color( 0x000000 ) );

		this.setSize( window.innerWidth, window.innerHeight );

		//this.context.getExtension( "OES_standard_derivatives" );
		//this.context.getExtension( "EXT_shader_texture_lod" );

	}

	setParent( parent ) {

		parent.appendChild( this.domElement );

	}

}

export default new Renderer();