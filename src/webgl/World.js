
import Camera               from "Globals/Camera";
import Scene                from "Globals/Scene";
import Renderer             from "Globals/Renderer";

import AssetManager         from "Common/loading/AssetManager";

import Base                 from "./Base";
import PostProcess          from "./postprocessing";
import Screen               from "./components/screen/Screen";
import Simulation           from "./components/simulation";
import Room                 from "./components/room";

import { OrbitControls }    from "three/examples/jsm/controls/OrbitControls";
import { BackSide, BoxGeometry, Color, DirectionalLight, DirectionalLightHelper, FrontSide, Mesh, MeshBasicMaterial, MeshNormalMaterial, PointLight, PointLightHelper } from "three";
import assets from "./globals/assets";
import ReflectionController from "./components/reflections/ReflectionController";
import VideoLightsController from "./components/lighting/VideoLightsController";

export default class World extends Base {

    constructor() {

        super();

        this.renderer   =   Renderer;
        this.scene      =   Scene;

        // this.controls               = new OrbitControls( Camera, this.renderer.domElement );
        // this.controls.enabled       = true;
        // this.controls.enableDamping = true;
        // this.controls.dampingFactor = 0.08;

        this.room       = new Room();

        this.videoLightsController = new VideoLightsController();
        this.reflectionController  = new ReflectionController( { object: this.room.floor } );

        Scene.add( this.room );

        const light = new PointLight( 0xFFFFFF, 0.5 );

        light.position.y = 10;

        this.scene.add( light );

        //const helper = new PointLightHelper( light, 5 );
        //this.scene.add( helper );    


    }

    resize() {

        let w = window.innerWidth;
        let h = window.innerHeight;
    
        Camera.aspect = w / h;
        Camera.updateProjectionMatrix();
    
        Renderer.setSize(w, h);

    }

    onMouseMove( ev ) {

        super.onMouseMove( ev );

    }

    onTouchEnd( ev ) {

        super.onTouchEnd( ev );

    }

    earlyUpdate( elapsedTime, delta ) {        

        super.earlyUpdate( elapsedTime, delta );
        
    }

    update( elapsedTime, delta ) {

        super.update( elapsedTime, delta );

        this.reflectionController.render( false );

        PostProcess.render( Scene, Camera );

        //Renderer.render( Scene, Camera )

    }

    lateUpdate( elapsedTime, delta ) {

        

        super.lateUpdate( elapsedTime, delta );
        
        if ( this.controls ) this.controls.update();

    }

}