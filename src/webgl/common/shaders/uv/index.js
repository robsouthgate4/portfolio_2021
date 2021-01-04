import { Material, ShaderMaterial, Vector2 } from "three";
import vertexShader                 from './meshUvs.vert';
import fragmentShader               from './meshUvs.frag';

export default class MeshUVsMaterial extends ShaderMaterial {

    constructor() {

        const uniforms = {
			
		};

        super( { uniforms, vertexShader, fragmentShader } );

    }

    resize( width, height ) {

		this.uniforms.uResolution.value = new Vector2( width, height );

	}

}