import { Mesh } from "three";
import TubeParametricBufferGeometry from "../geometry/TubeParametricBufferGeometry";
import TubeParametricMaterial 		from "../materials/tubeParametricMaterial/TubeParametricMaterial";

export default class TubeParametricMesh extends Mesh {

	constructor( { numSides, subdivisions, openEnded } ) {

		const geometry = new TubeParametricBufferGeometry( { numSides, subdivisions, openEnded } );
		const material = new TubeParametricMaterial( { numSides, subdivisions } );

		super( geometry, material );

		this.frustumCulled = false;

	}

}