import AssetManager from "Common/loading/AssetManager";
import Emitter from "Common/Emitter";
import { ClampToEdgeWrapping, RepeatWrapping } from "three";

const assets = {

	textures: {

		roomBaked: AssetManager.queue({

			url: require( "Assets/images/room_fullscale.png" ),
			type: 'texture',
			wrapS: RepeatWrapping,
			wrapT: RepeatWrapping

		}),

		matcap: AssetManager.queue({

			url: require( "Assets/images/matcapMetal.jpg" ),
			type: 'texture',
			wrapS: ClampToEdgeWrapping,
			wrapT: ClampToEdgeWrapping

		}),

		floorNormals: AssetManager.queue({

			url: require( "Assets/images/floor_normals.jpg" ),
			type: 'texture',
			wrapS: RepeatWrapping,
			wrapT: RepeatWrapping

		}),

		floorRoughnessMap: AssetManager.queue({

			url: require( "Assets/images/gradient_noise.jpg" ),
			type: 'texture',
			wrapS: RepeatWrapping,
			wrapT: RepeatWrapping

		}),
		
		// envMap: AssetManager.queue({

		// 	url: require( "Assets/images/env.hdr" ),
		// 	type: 'env-map',
		// 	hdr: true

		// })
 	

	},
	gltfs: {
		
		gallery: AssetManager.queue({

			url: require( "Assets/models/space4.glb" ),
			type: "gltf"
			
		}) 	


	},
	atlas: {

		// roboto: AssetManager.queue({

		// 	url: require( "Assets/images/roboto-thin-atlas.png" ).default,
		// 	type: 'texture',
		// 	wrapS: ClampToEdgeWrapping,
		// 	wrapT: ClampToEdgeWrapping

		// }),
		// lato: AssetManager.queue({

		// 	url: require( "Assets/images/lato-atlas.png" ).default,
		// 	type: 'texture',
		// 	wrapS: ClampToEdgeWrapping,
		// 	wrapT: ClampToEdgeWrapping

		// }),

	},
	fonts: {

		// roboto: AssetManager.queue({
		// 	url: require( "Assets/fonts/roboto/Roboto-Black.fnt" ).default,
		// 	type: 'font'
		// }),
		// lato: AssetManager.queue({
		// 	url: require( "Assets/fonts/lato/Lato-Font.fnt" ).default,
		// 	type: 'font'
		// })
		
	}
   
    
    
}

let loaded = 0;

const total = AssetManager.queueItems.length;

AssetManager.addProgressListener( () => {

	loaded ++;

	Emitter.emit( "assetloaded", { total, currentLoaded: loaded } );

} );

export default assets;