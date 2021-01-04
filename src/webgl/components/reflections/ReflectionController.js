
import Camera from "Globals/Camera";
import { Mesh, Scene as DummyScene, ShaderMaterial, ClampToEdgeWrapping, WebGLRenderTarget, MeshBasicMaterial, PlaneGeometry, Matrix4, LinearFilter, RepeatWrapping, Vector2, LinearMipmapLinearFilter, NearestMipMapLinearFilter, RGBAFormat, RGBFormat } from "three";
import Renderer 	from "Globals/Renderer";
import Scene 		from "Globals/Scene";

import blurVert from "Common/shaders/blur/blur.vert";
import blurFrag from "Common/shaders/blur/blur.frag";
import Triangle from "Common/Triangle";
import EventEmitter from "Common/Emitter"

import Gui from "Globals/Gui";

export default class ReflectionController {

	constructor( { object } ) {

		this.object = object;

		this.texture 		= null;
		this.resolution		= 0.8;
		this.iterations 	= 3;

		this.initGUIRegistration();		

		this.renderTarget 	= new WebGLRenderTarget( window.innerWidth * this.resolution, window.innerHeight * this.resolution );
		this.renderTarget.texture.flipY = false;
		

		this.fbo1 	= new WebGLRenderTarget( window.innerWidth * this.resolution, window.innerHeight * this.resolution );

		this.fbo2 	= new WebGLRenderTarget( window.innerWidth * this.resolution, window.innerHeight * this.resolution );

		

		this.shader   = new ShaderMaterial( {

			vertexShader: 	blurVert,
			fragmentShader: blurFrag,

			uniforms: {

				tDiffuse   : { value: null },
				flip       : { value: false },
				uStrength  : { value: new Vector2( 0, 0 ) },
				uResolution: { value: new Vector2( window.innerWidth, window.innerHeight ) }


            },

            depthTest:  false,
            depthWrite: false

		} );

		this.screen = new Mesh( Triangle, this.shader );

        this.screen.frustumCulled = false;

		this.dummyScene = new DummyScene();

		this.dummyScene.autoUpdate = false;

		this.dummyScene.add( this.screen );


	}

	initGUIRegistration() {

		Gui.Register({ type: 'folder', label: 'Reflections', open: true });

		Gui.Register([

			{ 
				type    : 'range',
				folder  : "Reflections",
				label   : 'Roughness',
				min     : 1,
				max     : 20,
				step    : 1,
				value   : this.iterations,
				onChange: ( value ) => this.handleRoughnessUpdate( value )
			},
			{
				type    : 'file',
				folder	: "Reflections",
				label   : 'File',
				property: 'file',
				onChange: ( data ) => {

					console.log( data );

				}
			}

		]);

	}

	resize( width, height ) {

		this.renderTarget.setSize( width, height );

	}

	handleRoughnessUpdate( value ) {

		this.iterations = value;

	}

	render( output ) {

		if ( ! Renderer ) return;

		const distance = 2.0 * ( Camera.position.y - this.object.position.y );

		Camera.position.y -= distance;

		Camera.rotation.x *= -1;
		Camera.rotation.z *= -1;

		this.object.hidden = true;

		 // Render scene
		
		Renderer.setRenderTarget( this.renderTarget );		
		Renderer.render( Scene, Camera );
		Renderer.setRenderTarget( null );

		// Render blur / iterations determines amount of blur
		for( let i = 0; i < this.iterations; i ++ ) {

			const radius = this.iterations - i - 1;
			 
			{

				Renderer.setRenderTarget( this.fbo2 );
			
				this.shader.uniforms.tDiffuse.value  = i === 0 ? this.renderTarget.texture : this.fbo1.texture;
				this.shader.uniforms.uStrength.value = i % 2 === 0 ? new Vector2( radius, 0 ) : new Vector2( 0, radius ); 
				
				Renderer.render( this.dummyScene, Camera );
				Renderer.setRenderTarget( null );

			}

			var t = this.fbo1
			this.fbo1 = this.fbo2
			this.fbo2 = t;


		}		

		EventEmitter.emit( "reflectionRendered", { original: this.renderTarget, blurred:  this.fbo1 } );

		this.object.hidden = false;

		Camera.position.y += distance;

		Camera.rotation.x *= -1;
		Camera.rotation.z *= -1;

		if ( output ) {

			Renderer.render( this.dummyScene, Camera ); // To change

		}

	}
	
}