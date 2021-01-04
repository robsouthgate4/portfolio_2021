// Taken from https://github.com/marcofugaro/threejs-modern-app/blob/master/src/lib/loadEnvMap.js



import clamp from 'lodash/clamp';
import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader';
import loadTexture from './loadTexture';
import { CubeTextureLoader, WebGLCubeRenderTarget, PMREMGenerator, UnsignedByteType, RGBM16Encoding } from 'three';
import { useImperativeHandle } from 'react';


export default async function loadEnvMap( url, options ) {

	const renderer = options.renderer;

	if ( ! renderer ) {

		throw new Error( `PBR Map requires renderer to passed in the options for ${url}!` );

	}

	if ( options.equirectangular ) {

		console.log( "Hey", url )

		const texture = await loadTexture( url, { renderer } );

		const cubeRenderTarget = new WebGLCubeRenderTarget( 1024, 1024 ).fromEquirectangularTexture(
			renderer,
			texture
		);

		const cubeMapTexture = cubeRenderTarget.texture;

		// renderTarget is used for the scene.background
		cubeMapTexture.renderTarget = cubeRenderTarget;

		texture.dispose(); // dispose original texture
		texture.image.data = null; // remove Image reference

		return buildCubeMap( cubeMapTexture, options );

	}

	const basePath = url;

	const isHDR = options.hdr;

	const extension = isHDR ? '.hdr' : '.png';
	const urls = genCubeUrls( `${basePath.replace( /\/$/, '' )}/`, extension );

	if ( isHDR ) {

		// load a float HDR texture
		return new Promise( ( resolve, reject ) => {

			new HDRCubeTextureLoader().load(
				UnsignedByteType,
				urls,
				map => resolve( buildCubeMap( map, options ) ),
				null,
				() => reject( new Error( `Could not load PBR map: ${basePath}` ) )
			);

		} );

	}

	// load a RGBM encoded texture
	return new Promise( ( resolve, reject ) => {

		new CubeTextureLoader().load(
			urls,
			cubeMap => {

				cubeMap.encoding = RGBM16Encoding;
				resolve( buildCubeMap( cubeMap, options ) );

			},
			null,
			() => reject( new Error( `Could not load PBR map: ${basePath}` ) )
		);

	} );

}

function buildCubeMap( cubeMap, options ) {

	if ( options.pbr || typeof options.level === 'number' ) {

		// prefilter the environment map for irradiance
		const pmremGenerator = new PMREMGenerator( cubeMap );
		pmremGenerator.update( options.renderer );

		// if ( options.pbr ) {

		// 	const pmremCubeUVPacker = new PMREMCubeUVPacker( pmremGenerator.cubeLods );
		// 	pmremCubeUVPacker.update( options.renderer );
		// 	const target = pmremCubeUVPacker.CubeUVRenderTarget;
		// 	cubeMap = target.texture;
		// 	pmremCubeUVPacker.dispose();

		// } else {

		// 	const idx = clamp( Math.floor( options.level ), 0, pmremGenerator.cubeLods.length );
		// 	cubeMap = pmremGenerator.cubeLods[ idx ].texture;

		// }

		const idx = clamp( Math.floor( options.level ), 0, pmremGenerator.cubeLods.length );
		cubeMap = pmremGenerator.cubeLods[ idx ].texture;

		pmremGenerator.dispose();

	}

	if ( options.mapping ) cubeMap.mapping = options.mapping;
	return cubeMap;

}

function genCubeUrls( prefix, postfix ) {

	return [
		`${prefix}px${postfix}`,
		`${prefix}nx${postfix}`,
		`${prefix}py${postfix}`,
		`${prefix}ny${postfix}`,
		`${prefix}pz${postfix}`,
		`${prefix}nz${postfix}`,
	];

}
