

import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer";
import Renderer from "Globals/Renderer";
import Scene 	from "Globals/Scene";
import Emitter  from "Common/Emitter";

import fragPosition from "./fragPosition.glsl";

import { Color, Mesh, MeshBasicMaterial, PlaneBufferGeometry, PlaneGeometry, Raycaster, Vector2 } from "three";
import Camera from "Globals/Camera";

//import gui from "Globals/UilGui";

export default class Simulation {

	constructor( { width, height } ) {

		const initialState = {

			power    : 1.78,
			dampening: 0.97,
			speed    : 1.16,
			brushSize: 0.01

		}


		// gui.add( 'slide', { name: 'Power', 	    callback: this.handlePressureUpdate.bind( this ), value: initialState.power, min: 0, max: 10 } );
		// gui.add( 'slide', { name: 'Dampening',  callback: this.handleDampenUpdate.bind( this ),   value: initialState.dampening, min: 0, max: 1 } );
		// gui.add( 'slide', { name: 'Speed', 		callback: this.handleSpeedUpdate.bind( this ), 	  value: initialState.speed, min: 0, max: 3 } );
		// gui.add( 'slide', { name: 'Brush size', callback: this.handleBrushSizeUpdate.bind( this ),value: initialState.brushSize, min: 0, max: 0.08 } );

		this.gpgpu 	= new GPUComputationRenderer( width, height, Renderer );		
		
		this.positionTexture 	= this.gpgpu.createTexture();
		this.originTexture 		= this.gpgpu.createTexture();
		
		const positionArray 	= this.positionTexture.image.data;
		const originArray	 	= this.originTexture.image.data;

		for ( let i = 0; i < originArray.length; i ++ ) {

			const stride = i * 4;

			originArray[ stride ] 		= 0;
			originArray[ stride + 1 ] 	= 0;
			originArray[ stride + 2 ] 	= 0;

			originArray[ stride + 3 ] 	= 1;			

		}
		
		for ( let i = 0; i < positionArray.length; i ++ ) {

			const stride = i * 4;

			positionArray[ stride ] 		= 0;
			positionArray[ stride + 1 ] 	= 0;
			positionArray[ stride + 2 ] 	= 0;

			positionArray[ stride + 3 ] 	= 1;
			
		}

		this.positionVariable = this.gpgpu.addVariable( "texturePosition", fragPosition, this.positionTexture );

		this.positionVariable.material.uniforms.time          = { value: 0 };
		this.positionVariable.material.uniforms.textureOrigin = { value: this.originTexture }
		this.positionVariable.material.uniforms.mouse         = { value: new Vector2( 0.0 ) }
		this.positionVariable.material.uniforms.power		  = { value: initialState.power }
		this.positionVariable.material.uniforms.brushSize	  = { value: initialState.brushSize }
		this.positionVariable.material.uniforms.speed		  = { value: initialState.speed }
		this.positionVariable.material.uniforms.dampen		  = { value: initialState.dampening }
		this.positionVariable.material.uniforms.delta         = { value: 0 };
		this.positionVariable.material.uniforms.innerForce    = { value: 0 };
		this.positionVariable.material.defines.NUM_POINTS     = width * height;

		this.gpgpu.setVariableDependencies( this.positionVariable, [ this.positionVariable ] ); 

		const error = this.gpgpu.init();

		if ( error !== null ) {

			console.error( error );

		}

		Emitter.on( "mousemove", 	this.handleMouseMove.bind( this ) );
		Emitter.on( "update", 		this.update.bind( this ) );

		// debug texture

		const quad = new PlaneGeometry( 3, 3 );

		const mat  = new MeshBasicMaterial( { 
			map        : this.gpgpu.getCurrentRenderTarget( this.positionVariable ).texture,
			opacity    : 1,
			transparent: true,
			depthWrite : false,
			depthTest  : false
		} );

		const mesh = new Mesh( quad, mat );

		mesh.position.z = -2.5;
		mesh.position.x = 0;

		//Scene.add( Camera );

		//Camera.add( mesh );

		this.mouse = new Vector2();

		this.angle = 0;
		

		this.raycast = new Raycaster();
		
		this.raycastPlaneGeo 	= new PlaneBufferGeometry( 1, 1 );
		this.raycastPlaneMat 	= new MeshBasicMaterial( { color: new Color( "rgb( 255, 0, 0 )" ) } );
		this.raycastPlaneMesh	= new Mesh( this.raycastPlaneGeo, this.raycastPlaneMat );
		//this.raycastPlaneMesh.rotateZ( Math.PI * 2 );
		this.raycastPlaneMesh.scale.set( width / 6.7, height / 6.7 );
		this.raycastPlaneMesh.visible = false;
		this.raycastPlaneMesh.position.y -= 0.05;

		Scene.add( this.raycastPlaneMesh );		

		this.mouseMoving = false;
		this.mouse       = {};
		this.uvCoords	 = new Vector2();
		

	}

	handleBrushSizeUpdate( value ) {

		this.positionVariable.material.uniforms.brushSize.value = value;

	}

	handleSpeedUpdate( value ) {

		this.positionVariable.material.uniforms.speed.value = value;

	}

	handleDampenUpdate( value ) {

		this.positionVariable.material.uniforms.dampen.value = value;

	}

	handlePressureUpdate( value ) {
		
		this.positionVariable.material.uniforms.power.value = value;

	}

	handleMouseMove( evt ) {

		this.mouseMoving = true;
		this.mouse       = evt.normalized;

	}

	update( { delta, elapsed } ) {

		this.angle += 0.01;

		if ( this.mouseMoving ) {

			this.raycast.setFromCamera( this.mouse, Camera );

			const intersect = this.raycast.intersectObject( this.raycastPlaneMesh );

			if ( intersect.length > 0 ) {

				this.uvCoords = intersect[ 0 ].uv;

			}			

			this.mouseMoving = false;

		}

		this.gpgpu.compute();

		this.positionVariable.material.uniforms.time.value  = elapsed;
		this.positionVariable.material.uniforms.delta.value = delta;
		this.positionVariable.material.uniforms.mouse.value = this.uvCoords;

		
		
	}

}

