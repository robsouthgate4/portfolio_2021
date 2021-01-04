import { CameraHelper, Color, MeshBasicMaterial, MeshStandardMaterial, ShaderMaterial, VideoTexture } from "three";

import AssetManager from "Common/loading/AssetManager";
import assets 		from "Globals/assets";

import vertexShader 	from "./room.vert";
import fragmentShader 	from "./room.frag";

import Emitter 			from "Common/Emitter";
import ProjectorCamera  from "Globals/ProjectorCamera";
import Scene  			from "Globals/Scene";

export default class RoomMaterial extends ShaderMaterial {

	constructor() {

	 	const texture = AssetManager.get( assets.textures.roomBaked );
		texture.flipY = false;

		

		const uniforms = {

			map                   : { value: texture },
			viewMatrixCamera      : { type: 'm4', value: null },
			time      			  : { value: 0 },
			projectionMatrixCamera: { type: 'm4', value: null },
			modelMatrixCamera     : { type: 'mat4', value: null },
			projPosition          : { type: 'v3', value: null },
			textureColour         : { type: "t", value: AssetManager.get( assets.textures.hills ) },

		}

		super( { vertexShader, fragmentShader, uniforms } );

		this.projectionCamera 		 = ProjectorCamera;

		const cameraHelper = new CameraHelper( this.projectionCamera );

		//Scene.add( cameraHelper );

		const viewMatrixCamera       = this.projectionCamera.matrixWorldInverse.clone();
		const projectionMatrixCamera = this.projectionCamera.projectionMatrix.clone();
		const modelMatrixCamera      = this.projectionCamera.matrixWorld.clone();

		this.uniforms.viewMatrixCamera.value       = viewMatrixCamera;
		this.uniforms.projectionMatrixCamera.value = projectionMatrixCamera;
		this.uniforms.modelMatrixCamera.value      = modelMatrixCamera;

		Emitter.on( "update", this.update.bind( this ) );

		Emitter.on( "apploaded", domElements => { 

			console.log( domElements.video )

			this.uniforms.textureColour.value = new VideoTexture( domElements.video );

		} );

	}

	update( { elapsed, delta } ) {		

		this.uniforms.projPosition.value  = this.projectionCamera.position;

		this.uniforms.time.value = elapsed;

	}

}