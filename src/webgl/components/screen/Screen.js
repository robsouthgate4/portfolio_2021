import { Mesh, InstancedBufferGeometry, InstancedBufferAttribute, CameraHelper, BoxBufferGeometry, PerspectiveCamera } from "three";

import ScreenMaterial 	from "./ScreenMaterial";
import Emitter 					from "Common/Emitter";
import AssetManager 			from "Common/loading/AssetManager";
import assets 					from "Globals/assets";
import Scene					from "Globals/Scene";
import Camera 					from "Globals/Camera";

export default class Screen extends Mesh {

	constructor( { width, height, simulation } ) {

		const geometry 	= new BoxBufferGeometry( 1.5, 1 );

		geometry.scale( 3, 3, 3 );

		const instanced = new InstancedBufferGeometry().copy( geometry );

		const count = width * height;
		
		instanced.instanceCount = count;

		const material = new ScreenMaterial( { numParticles: count } );

		let offsets     = [];
		let instanceIds = [];
		let colours     = [];
		let scaleYs		= [];

		const colourPalette = [ 0x6e2526, 0xcd9cca, 0x242146 ];

		const gridSizeX 		= width;
		const gridSizeY 		= height;

		const gridSpacing 	= 4;

		let i = 0;

		for ( let x = 0; x < gridSizeX; x++ ) {			

			for ( let y = 0; y < gridSizeY; y++ ) {

				i ++;

				const posX = ( gridSpacing * 1.5 * ( x - ( ( gridSizeX - 1 ) * 0.5 ) ) );

				const posY = ( gridSpacing * 1 * ( y - ( ( gridSizeY - 1 ) * 0.5 ) ) );

				offsets.push( posX, posY, 0 );

				instanceIds.push( i );

			}	

		}
		
		material.uniforms.tHeight.value	  = gridSizeX;
		material.uniforms.tWidth.value	  = gridSizeY;

		material.uniforms.texturePosition.value 		= simulation.gpgpu.getCurrentRenderTarget( simulation.positionVariable ).texture;
		
		instanced.setAttribute( "instanceId", 	new InstancedBufferAttribute( new Float32Array( instanceIds ), 1, false ) );
		instanced.setAttribute( "scaleY", 		new InstancedBufferAttribute( new Float32Array( scaleYs ), 1, false ) );
		instanced.setAttribute( "offset", 		new InstancedBufferAttribute( new Float32Array( offsets ), 3, false ) );
		instanced.setAttribute( "colour", 		new InstancedBufferAttribute( new Float32Array( colours ), 3, false ) );

		super( instanced, material );		

		this.frustumCulled = false;

		this.simulation = simulation;

		//this.rotation.x = - Math.PI / 3

		Emitter.on( "update", 	 this.update.bind( this ) );		

	}
	

	update( { elapsed } ) {

		//this.rotation.x = ( - Math.PI / 2 ) * Math.abs( Math.sin( elapsed * 0.1 ) );

		this.material.uniforms.texturePosition.value = this.simulation.gpgpu.getCurrentRenderTarget( this.simulation.positionVariable ).texture;		

	}

}