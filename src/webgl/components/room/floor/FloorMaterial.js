import { CameraHelper, Color, DoubleSide, MeshBasicMaterial, MeshStandardMaterial, RawShaderMaterial, ShaderMaterial, Vector3, VideoTexture } from "three";

import AssetManager from "Common/loading/AssetManager";
import assets 		from "Globals/assets";

import vertexShader 	from "./floor.vert";
import fragmentShader 	from "./floor.frag";

import Emitter 			from "Common/Emitter";
import ProjectorCamera  from "Globals/ProjectorCamera";
import Scene  			from "Globals/Scene";

export default class FloorMaterial extends ShaderMaterial {

	constructor() {
		
		const uniforms = {

			reflectionMap       : { value: null },
			reflectionMapBlurred: { value: null },
			map                 : { value: AssetManager.get( assets.textures.matcap ) },
			time                : { value: 0 },
			textureColour       : { type: "t", value: AssetManager.get( assets.textures.matcap ) },
			roughness           : { value: 1 },
			tileNormalMap       : { value: AssetManager.get( assets.textures.floorNormals ) },
			tileNormalStrength  : { value: 0.2 },
			floorRoughnessMap   : { value: AssetManager.get( assets.textures.floorRoughnessMap ) },
			lightColor          : { value: new Vector3( 0, 0, 0 ) }

		}

		super( { vertexShader, fragmentShader, uniforms } );

		Emitter.on( "update", 				this.update.bind( this ) );
		Emitter.on( "lightColorUpdate", 	this.handleLightColorUpdate.bind( this ) );
		Emitter.on( "reflectionRendered", 	this.handleReflectionRendered.bind( this ) );

	}

	handleLightColorUpdate( color ) {
		
		this.uniforms.lightColor.value = color;

	}

	handleReflectionRendered( buffers ) {

		const { original, blurred } = buffers;

		//this.uniforms.reflectionMap.value        = original.texture;
		this.uniforms.reflectionMapBlurred.value = blurred.texture;

	}

	update( { elapsed, delta } ) {

		this.uniforms.time.value = elapsed;

	}

}