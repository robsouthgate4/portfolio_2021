import { Color, Mesh, PlaneBufferGeometry, ShaderMaterial} from "three";

import vertexShader 	from "./background.vert";
import fragmentShader 	from "./background.frag";

import Triangle			from "Common/Triangle"

export default class Background extends Mesh {

	constructor() {

		const uniforms = {

			aspect: { value: window.innerWidth / window.innerHeight },
			color1: { value: new Color( 0x050528 ) },
			color2: { value: new Color( 0x281146 ) }

		}

		const material = new ShaderMaterial( { vertexShader, fragmentShader, uniforms } );

		material.depthWrite = false;
		material.depthTest  = false;		

		super( Triangle, material );

		this.renderOrder = -10000;

		this.frustumCulled = false;

		this.matrixAutoUpdate = false;

	}

}