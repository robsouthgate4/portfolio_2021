import { Mesh} from 'three';

import MSDFMaterial from "Common/materials/MSDFMaterial";

import Utils		from "Common/Utils";

const createGeometry = require( "Common/libs/three-bmfont-text" );

export default class MSDFMesh extends Mesh {

	constructor( { texture, font, text, width, align, letterSpacing } ) {

		const material = new MSDFMaterial( { texture } );

		const geometry = createGeometry({

			font,
			text,
			width,
			align,
			letterSpacing

		});
		
		super( geometry, material );		

	}

	handleDayUpdate( day ) {

		this.geometry.update( `DAY : ${  Utils.pad( day + 1, 3 ) }` )

	}

}