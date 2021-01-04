// Taken from https://github.com/marcofugaro/threejs-modern-app/blob/master/src/lib/loadTexture.js

import loadImage from 'image-promise';
import { ClampToEdgeWrapping, LinearEncoding, LinearFilter, LinearMipMapLinearFilter, RGBAFormat, RGBFormat, Texture } from 'three';

export default async function loadTexture( url, options ) {

	const texture = new Texture();
	texture.name = url;
	texture.encoding = options.encoding || LinearEncoding;
	setTextureParams( url, texture, options );

	try {

		const image = await loadImage( url, { crossorigin: 'anonymous' } );

		texture.image = image;
		texture.needsUpdate = true;
		if ( options.renderer ) {

			// Force texture to be uploaded to GPU immediately,
			// this will avoid "jank" on first rendered frame
			options.renderer.initTexture( texture );

		}

		return texture;

	} catch ( err ) {

		throw new Error( `Could not load texture ${url}` );

	}

}

function setTextureParams( url, texture, opt ) {

	if ( typeof opt.flipY === 'boolean' ) texture.flipY = opt.flipY;
	if ( typeof opt.mapping !== 'undefined' ) {

		texture.mapping = opt.mapping;

	}

	if ( typeof opt.format !== 'undefined' ) {

		texture.format = opt.format;

	} else {

		// choose a nice default format
		const isJPEG = url.search( /\.(jpg|jpeg)$/ ) > 0 || url.search( /^data:image\/jpeg/ ) === 0;
		texture.format = isJPEG ? RGBFormat : RGBAFormat;

	}

	if ( opt.repeat ) texture.repeat.copy( opt.repeat );
	texture.wrapS = opt.wrapS || ClampToEdgeWrapping;
	texture.wrapT = opt.wrapT || ClampToEdgeWrapping;
	texture.minFilter = opt.minFilter || LinearMipMapLinearFilter;
	texture.magFilter = opt.magFilter || LinearFilter;
	texture.generateMipmaps = opt.generateMipmaps !== false;

}
