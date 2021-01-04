import { isTouchDevice } 	from "Globals/Constants";
import Emitter 	 			from "Common/Emitter";

import 	* as Stats from "stats.js";

export default class Base {

	constructor() {

		this.stats = new Stats();
		this.stats.showPanel( 0 );
		document.body.appendChild( this.stats.dom );

		this.isRunning 		= false;
		this.requestFrame 	= null;
		this.elapsed		= null;

		this.mouse			= {};

		this.width 			= window.innerWidth;
		this.height 		= window.innerHeight;

		this.createEvents();

	}

	start() {

		this.now 		= Date.now();
		this.isRunning 	= true;

		this.run();		

	}	

	createEvents() {

		if( isTouchDevice() ){

            window.addEventListener( "touchstart", this.onTouch.bind( this ) );
            window.addEventListener( "touchend",   this.onTouchEnd.bind( this ) );
            window.addEventListener( "touchmove",  this.onMouseMove.bind( this ) );
        }

        else{

            window.addEventListener( "mousedown", 	this.onTouch.bind( this ) );
            window.addEventListener( "mouseup",  	this.onTouchEnd.bind( this ) );
			window.addEventListener( "mousemove", 	this.onMouseMove.bind( this ) );
			window.addEventListener( "wheel",		this.onWheel.bind( this ) );

		}

		window.addEventListener( "resize", this.onResize.bind( this ) );
		

	}

	onResize() {

		Emitter.emit( "resize" );

	}

	onTouch( ev ) {
		
		this.mouse = this.getMouse( ev );

		Emitter.emit( "touch", this.mouse );
		
	}

	onTouchEnd( ev ) {

		this.mouse = this.getMouse( ev );

		Emitter.emit( "touchend", this.mouse );

	}

	onWheel( ev ) {

		Emitter.emit( "wheel", {

			direction: Math.sign( ev.deltaY )

		} );

	}

	onMouseMove( ev ) {

		if ( ev.touches ){

            if( ev.touches.length > 1){

                return;
            }
          
        }

        ev.preventDefault();
        ev.stopPropagation();

		this.mouse = this.getMouse( ev );
		
		Emitter.emit( "mousemove", this.mouse );

	}

	getMouse( ev ) {

		if( ev.changedTouches ){

            ev = ev.changedTouches[ 0 ]
        }

        return {

            normalized: {

                x: ( ev.clientX / window.innerWidth ) * 2 - 1,
				y: - ( ev.clientY / window.innerHeight ) * 2 + 1
				
            },
            raw: {

                x: ev.clientX,
				y: ev.clientY
				
            },
            rawNormalized: {

                x: ( ev.clientX - ( window.innerWidth * 0.5 ) ) * 2,
				y: ( ev.clientY - ( window.innerHeight * 0.5 ) ) * 2,
				
            }
        }

	}

	pause() {

		if( this.requestFrame ) {

			cancelAnimationFrame( this.requestFrame );

			this.requestFrame = null;

		}

		this.isRunning = false;

	}

	earlyUpdate( elapsed, delta ) {
		
		Emitter.emit( "earlyupdate", { elapsed, delta } );

	}

	update( elapsed, delta ) {

		Emitter.emit( "update", { elapsed, delta } );

	}

	lateUpdate( elapsed, delta ){

		Emitter.emit( "lateupdate", { elapsed, delta } );
		
	}

	run() {

		if ( ! this.isRunning ) {

			this.now = Date.now();

		}

		let tempnow = Date.now();

        let delta = ( tempnow - this.now ) / 1000;

        this.now = tempnow;

		this.elapsed += delta;

		this.stats.begin();

		this.earlyUpdate( this.elapsed, delta );

		this.update( this.elapsed, delta );

		this.lateUpdate( this.elapsed, delta );
		
		this.stats.end();
		
		if ( this.isRunning ) {

			this.requestFrame = requestAnimationFrame( this.run.bind( this ) );			

		}

		

	}

}