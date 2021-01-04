import { 

	PerspectiveCamera, 
	Vector2, 
	Vector3
} 
from "three";

import { TweenLite } 	from "gsap/gsap-core";
import Renderer 		from "Globals/Renderer";
import Emitter			from "Common/Emitter";
import Camera			from "Globals/Camera";

class ProjectorCamera extends PerspectiveCamera {

	constructor( ) {

		super( 45, Camera.aspect, Camera.near, Camera.far );

		this.position.set( 0, 20, 100 );

		this.updateProjectionMatrix();
    	this.updateMatrixWorld();
		this.updateWorldMatrix();

		Emitter.on( "update", 	 	this.update.bind( this ) );

	}

	update ( data ) {


	}

}

export default new ProjectorCamera();