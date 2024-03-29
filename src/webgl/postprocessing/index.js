import {
    Mesh,
    ShaderMaterial,
    Vector2,
    Scene as PostScene } from "three";


import Utils        from "Common/Utils";

import copyVert     from "Common/shaders/copy/copy.vert";
import copyFrag     from "Common/shaders/copy/copy.frag";

import Renderer         from "Globals/Renderer";
import Scene            from "Globals/Scene";
import Camera           from "Globals/Camera";

import ShaderPass       from "Common/passes/ShaderPass";
import RenderPass       from "Common/passes/RenderPass";

import BlurShader       from "Common/shaders/blur/BlurShader";
import FXAAShader       from "Common/shaders/fxaa/FXAAShader";
import CombineShader    from "Common/shaders/combine/CombineShader";

class PostProcess {

    constructor( ) {

        this.renderer   = Renderer;
        this.scene      = Scene;
        this.camera     = Camera;
        
        this.blurXOut   = Utils.CreateFBO( false );
        this.blurYOut   = Utils.CreateFBO( false );
        
        this.copyShader   = new ShaderMaterial( {

            vertexShader:   copyVert,
            fragmentShader: copyFrag,

            uniforms: {

                tDiffuse:       { value: null }

            },

            depthTest:  false,
            depthWrite: false

        } );

        this.blurXShader    = new BlurShader( { direction: new Vector2( 1, 0 ) } );
        this.blurYShader    = new BlurShader( { direction: new Vector2( 0, 1 ) } );
        this.fxaaShader     = new FXAAShader();
        this.combineShader  = new CombineShader();
        
        this.renderPass     = new RenderPass();

        this.copyPass       = new ShaderPass( this.copyShader );
        this.blurXPass      = new ShaderPass( this.blurXShader );
        this.blurYPass      = new ShaderPass( this.blurYShader );
        this.fxaaPass       = new ShaderPass( this.fxaaShader );
        this.combinePass    = new ShaderPass( this.combineShader );
        
        this.resize();

        window.addEventListener( "resize", this.resize.bind( this ) );
      

    }



    resize( ) {

        this.blurXShader.resize( window.innerWidth, window.innerHeight );
        this.blurYShader.resize( window.innerWidth, window.innerHeight );
        this.fxaaShader.resize( window.innerWidth, window.innerHeight );
        this.combineShader.resize( window.innerWidth, window.innerHeight );

        this.renderPass.resize( window.innerWidth, window.innerHeight );
        this.blurXPass.resize( window.innerWidth, window.innerHeight );
        this.blurYPass.resize( window.innerWidth, window.innerHeight );
        this.fxaaPass.resize( window.innerWidth, window.innerHeight );
        this.combinePass.resize( window.innerWidth, window.innerHeight );

    }

    render( ) {

        this.renderPass.render( false );

        this.fxaaPass.render( this.renderPass.target, false );

        this.combinePass.render( this.fxaaPass.target, true );

    }
    

}

export default new PostProcess();