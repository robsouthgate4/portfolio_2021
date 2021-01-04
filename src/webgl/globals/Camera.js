import { 

	PerspectiveCamera, 
	Vector2, 
	Vector3
} 
from "three";

import { TweenLite } 	from "gsap/gsap-core";
import Renderer 		from "Globals/Renderer";
import Emitter			from "Common/Emitter";


class Camera extends PerspectiveCamera {

	constructor( ) {

		super( 45, window.innerWidth / window.innerHeight, 0.001, 20000 );

		this.position.set( 0, 12, 80 );

		this.runGaze = true;

		this.startPos 	= this.position;
		this.mouse 		= {};
		this.canvas 	= Renderer.domElement;		

		Emitter.on( "update", 	 	this.update.bind( this ) );
		Emitter.on( "mousemove", 	this.handleMouseMove.bind( this ) );

		this.initialPosition = this.position.clone();

		this.mouse = {
			x: 0,
			y: 0
		};

		this.target = {
			x: 0,
			y: 0,
			z: 35
		};
		

	}

	handleMouseMove( mouse ) {

		this.mouse = mouse.normalized;

	}

	update ( data ) {

		if ( this.runGaze ) {

			this.lookAt( 0, 10, -10 );

			this.target.x = this.mouse.x * 8.0;

			this.target.y = this.initialPosition.y + this.mouse.y  * 3.0;

			this.position.x += 0.01 * ( this.target.x - this.position.x );
			this.position.y += 0.01 * ( this.target.y - this.position.y );
			this.position.z += 0.01 * ( this.target.z - this.position.z - ( this.mouse.y * 8.0) );

		}

	}

}

export default new Camera();