import {PerspectiveCamera, CameraHelper, FrontSide, RawShaderMaterial, Vector2 } from "three";

import vertexShader 	from "./vertexShader.glsl";
import fragmentShader	from "./fragmentShader.glsl";

import Emitter 			from "Common/Emitter";
import AssetManager		from "Common/loading/AssetManager";
import assets			from "Globals/assets";
import Camera			from "Globals/Camera";
import Scene			from "Globals/Scene";
import ProjectorCamera  from "Globals/ProjectorCamera";

export default class ScreenMaterial extends RawShaderMaterial {

	constructor( { numCubes } ) {

		const defines = {
			
			NUM_CUBES: numCubes

		}		

		const uniforms = {

			time                  : { value: 0 },
			cameraInfo            : { value: new Vector2( Camera.near, Camera.far ) },
			cameraPosition        : { value: Camera.position },
			texturePosition       : { type: "t", value: null },
			textureColour         : { type: "t", value: AssetManager.get( assets.textures.hills ) },
			matcap                : { type: "t", value: AssetManager.get( assets.textures.matcap ) },
			tHeight               : { value: null },
			tWidth                : { value: null },
			viewMatrixCamera      : { type: 'm4', value: null },
			projectionMatrixCamera: { type: 'm4', value: null },
			modelMatrixCamera     : { type: 'mat4', value: null },
			projPosition          : { type: 'v3', value: null }

		}

		super( { vertexShader, fragmentShader, uniforms, defines, side: FrontSide, transparent: true } );

		this.projectionCamera 		 = ProjectorCamera;
		const viewMatrixCamera       = this.projectionCamera.matrixWorldInverse.clone();
		const projectionMatrixCamera = this.projectionCamera.projectionMatrix.clone();
		const modelMatrixCamera      = this.projectionCamera.matrixWorld.clone();

		const cameraHelper = new CameraHelper( this.projectionCamera );

		//Scene.add( cameraHelper );

		this.uniforms.viewMatrixCamera.value       = viewMatrixCamera;
		this.uniforms.projectionMatrixCamera.value = projectionMatrixCamera;
		this.uniforms.modelMatrixCamera.value      = modelMatrixCamera;		

		//this.projectionCamera.lookAt( this );

		Emitter.on( "update", this.update.bind( this ) );

		this.initialProjectorPosition = this.projectionCamera.position;

	}

	update( { elapsed, delta } ) {
		

		this.uniforms.projPosition.value  = this.projectionCamera.position;

		this.uniforms.time.value = elapsed;

	}



}