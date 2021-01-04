// from https://mattdesl.svbtle.com/shaping-curves-with-parametric-equations

import { BufferAttribute, BufferGeometry, CylinderGeometry, Vector2 } from "three";


export default class TubeParametricBufferGeometry extends BufferGeometry {

	constructor( { numSides = 8, subdivisions = 100, openEnded = false } ) {

		// create a base CylinderGeometry which handles UVs, end caps and faces
		const radius = 1;
		const length = 1;

		const baseGeometry = new CylinderGeometry( radius, radius, length, numSides, subdivisions, openEnded );

		// fix the orientation so X can act as arc length

		baseGeometry.rotateZ( Math.PI / 2 );

		// compute the radial angle for each position for later extrusion

		const tmpVec 		= new Vector2();
		const xPositions 	= [];
		
		const angles 		= [];
		const uvs 			= [];
		const vertices = baseGeometry.vertices;
		const faceVertexUvs = baseGeometry.faceVertexUvs[0];

		// Now go through each face and un-index the geometry.

		baseGeometry.faces.forEach((face, i) => {

			const { a, b, c } = face;

			const v0 = vertices[a];
			const v1 = vertices[b];
			const v2 = vertices[c];


			const verts = [v0, v1, v2];

			const faceUvs = faceVertexUvs[i];

			// For each vertex in this face...

			verts.forEach((v, j) => {

				tmpVec.set(v.y, v.z).normalize();

				// the radial angle around the tube
				const angle = Math.atan2(tmpVec.y, tmpVec.x);

				angles.push(angle);

				// "arc length" in range [-0.5 .. 0.5]
				xPositions.push( v.x );

				// copy over the UV for this vertex
				uvs.push(faceUvs[j].toArray());

			});

		});

		// build typed arrays for our attributes
		const posArray 		= new Float32Array( xPositions );
		const angleArray 	= new Float32Array( angles );
		const uvArray 		= new Float32Array( uvs.length * 2 );

		console.log( xPositions.length );

		// unroll UVs
		for (let i = 0; i < posArray.length; i++) {

			const [u, v] = uvs[i];
			uvArray[i * 2 + 0] = u;
			uvArray[i * 2 + 1] = v;

		}
		
		// dispose old geometry since we no longer need it
		baseGeometry.dispose();

		super();

		this.setAttribute( 'position', 		new BufferAttribute( posArray, 1 ) );
		this.setAttribute( 'angle', 		new BufferAttribute( angleArray, 1 ) );
		this.setAttribute( 'uv', 			new BufferAttribute( uvArray,  2) );


	}

}
