import { Mesh, DoubleSide, Geometry, BufferGeometry, Object3D, MeshPhongMaterial, MeshNormalMaterial, MeshBasicMaterial, Color, MeshMatcapMaterial, VideoTexture, MeshLambertMaterial, TextureLoader, CullFaceNone } from "three";

import FloorMaterial 			from "./floor/FloorMaterial";
import Emitter 					from "Common/Emitter";
import AssetManager 			from "Common/loading/AssetManager";
import MeshUVsMaterial			from "Common/shaders/uv";
import assets 					from "Globals/assets";

export default class Room extends Object3D {

	constructor( ) {

		super();
		
		this.floor   = null;
		this.walls   = null;
		this.screens = null;
		this.panels  = null;

		const glb = AssetManager.get( assets.gltfs.gallery ).scene;

		this.modelChildren = glb.children;

		this.modelChildren.forEach( el => { 

			const { name } = el;			

			if ( name.includes( "Vents" ) ) {

				el.material = new MeshPhongMaterial( { color: new Color( "rgb( 1, 1, 1 )" ), shininess: 10 } );

			}

			if ( name.includes( "Screen" ) ) {				

				el.material = new MeshMatcapMaterial( { matcap: AssetManager.get( assets.textures.matcap ), color: 0x232323 } );				

			}

			if ( name === "Floor" ) {

				el.material            = new FloorMaterial();
				this.floor             = el;
				this.floor.position.y -= 0.1;

			}

			if ( name.includes( "Walls" ) ) {

				el.material = new MeshPhongMaterial( { color: new Color( "rgb( 0, 0, 0 )" ), side: DoubleSide, shininess: 0.9,  } );

			}

			if ( name === "Panel1" ) {

				el.material  = new MeshBasicMaterial( { 
					color: 0x000000, 
				} );

				el.material.needsUpdate     = true;

			}

			if ( name === "Panel3" ) {

				el.material  = new MeshBasicMaterial( { 
					color: 0xFFFFFF, 
				} );

				el.material.needsUpdate     = true;

				const map = new TextureLoader().load( "/assets/images/tomorrowland.jpg" );
				map.flipY = false;					

				el.material.map = map;
			}

		} );


		this.add( glb );

		this.scale.setScalar( 3 );
		this.position.x -= 2;

		Emitter.on( "apploaded", this.handleAppLoaded.bind( this ) );
		Emitter.on( "update", 	 this.update.bind( this ) );		

	}

	handleAppLoaded( domElements ) {

		const { videoOne, videoTwo , videoThree } = domElements;

		this.modelChildren.forEach( el => {

			if ( el.name === "Panel1" ) {				

				const videoOneTexture = new VideoTexture( videoOne );
				videoOneTexture.flipY = false;			

				el.material = new MeshBasicMaterial( { map: videoOneTexture, color: 0xFFFFFF } );
				videoOne.play();

			}


			if ( el.name === "Panel2" ) {				

				const videoTwoTexture = new VideoTexture( videoTwo );
				videoTwoTexture.flipY = false;			

				el.material = new MeshBasicMaterial( { map: videoTwoTexture, color: 0xFFFFFF } );
				videoTwo.play();

			}

			if ( el.name === "Panel3" ) {

				const videoThreeTexture = new VideoTexture( videoThree );
				videoThreeTexture.flipY = false;

				el.material = new MeshBasicMaterial( { map: videoThreeTexture, color: 0xFFFFFF } );
				videoThree.play();

			}

		} );

	}
	

	update( { elapsed } ) {

	
	}

}