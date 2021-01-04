import * as THREE from "three";

import AssetManager from "Common/loading/AssetManager.js";
import Renderer     from "Globals/Renderer";
import World        from "./World";
import Emitter      from "Common/Emitter";

import _            from "lodash";

import { isMobile } from "Globals/Constants";

window.THREE = THREE;

export default class {

    constructor( { parent, video1, video2, video3 } ) {        

        Renderer.setParent( parent );

        this.domElements = {};

        this.domElements.videoOne   = video1
        this.domElements.videoTwo   = video2;
        this.domElements.videoThree = video3;
        
        this.domElements.parent     = parent;

        this.percentageBar  = document.querySelector( ".percentage-bar" );
        this.loadingMessage = document.querySelector( ".loading-message" );
        this.desktopMessage = document.querySelector( ".desktop-only" );

        if ( isMobile ) {

            // this.loadingMessage.style.display = "none";
            // this.desktopMessage.classList.add( "visible" );

        }


        Emitter.on( "assetloaded", this.handleAssetLoad.bind( this ) );

        

    }

    handleAssetLoad ( obj ) {

        // const percent        = Math.round( ( obj.currentLoaded / obj.total ) * 100 );
        // this.percentageBar.style.width = `${percent}%`;
    
    }     

    handlePageIn( currentPage ) {

        console.log( "currentPage", currentPage );

    }

    handlePageOut( previousPage ) {

        console.log( "previousPage", previousPage );

    }

    start() {

        AssetManager.load( { renderer: Renderer } ).then( () => {
        
            const world = new World();
        
            world.start();
        
            Emitter.emit( "apploaded", this.domElements );
        
            window.addEventListener( "resize", () => {
        
                world.resize( window.innerWidth, window.innerHeight );
            
            } );
        
        });

    }

}






