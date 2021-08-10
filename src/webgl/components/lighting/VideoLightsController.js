
import Emitter from "Common/Emitter"
import { Color, HemisphereLight, PointLight, PointLightHelper, Vector3, VideoTexture } from "three";
import Scene from "Globals/Scene";
import Gui   from "Globals/Gui"

export default class VideoLightsController {

	constructor( ) {

		this.generateLights = true;
		
		Emitter.on( "apploaded", this.handleAppLoaded.bind( this ) );

		Gui.Register({ type: 'folder', label: 'Lighting', open: true });

		this.lightIntentsity = 10.4;

		// Gui.Register([

		// 	{ 
		// 		type    : 'range',
		// 		folder  : "Lighting",
		// 		label   : 'Light intensity',
		// 		min     : 0.01,
		// 		max     : 0.1,
		// 		step    : 0.01,
		// 		value   : this.lightIntentsity,
		// 		onChange: ( value ) => this.handleLightIntensityUpdate( value )
		// 	}

		// ]);
		
	}

	handleLightIntensityUpdate( value ) {

		this.panel1Light.intensity = value

	}

	handleAppLoaded( domElements ) {		

		if ( this.generateLights ) {

			const { videoOne } = domElements;

			videoOne.addEventListener( "canplay", () => {

				const videoTexture = new VideoTexture( videoOne );

				const width 		= videoTexture.image.videoWidth;
				const height 		= videoTexture.image.videoHeight;

				const canvas  = document.createElement( "canvas" );
				canvas.id = "canvasVideo";

				document.body.append( canvas );

				Object.assign( canvas.style, {
					display : "none",
					position: "absolute",
					left    : 0,
					top     : 0,
					width   : width / 4 + "px",
					height  : height / 4 + "px",
					zIndex  : 100
				} );

				const context = canvas.getContext( "2d" );

				canvas.width  = width ;
				canvas.height = height;

				console.log( "can play video" );

				setTimeout( () => {

					setInterval(() => {
			
						this.update( { context, videoTexture, width, height } );
			
					}, 1000 / 6 );

				}, 1000 );				

			} );		

		}
		
		this.panel1Light = new PointLight( new Color( "#FFFFFF" ), this.lightIntentsity );

		
		this.panel1Light.position.y = 10;
		this.panel1Light.position.z = -30;
		

		this.lightHelper = new PointLightHelper( this.panel1Light, 1, this.panel1Light.color )
		
		Scene.add( this.panel1Light);


	}

	update( drawData ) {

		//const { context, videoTexture, width, height } = drawData;

		//context.drawImage( videoTexture.image, 0, 0 );

		// if(!context) return;

		// const imageData = context.getImageData(0, 0, width, height);

		// const data = imageData.data;

		// let sample_size = width * height;

		let lightColor = new Color("rgb(255, 0, 0)");

		// const divider = 1000;

		// for (let y = 0; y < height / divider; y += sample_size / divider ) {

		// 	for (let x = 0; x < width / divider; x += sample_size / divider) {

		// 		let p = ( x + ( y * width ) ) * 4;
				
		// 		lightColor.setRGB( data[ p ], data[ p + 1 ], data[ p + 2 ] );

		// 		//context.fillStyle = "rgba(" + data[ p ] + "," + data[ p + 1 ] + "," + data[ p + 2 ] + "," + data[ p + 3 ] + ")";
		// 		//context.fillRect( x, y, sample_size / divider, sample_size / divider );

		// 	}
		// }

		this.panel1Light.color = lightColor;

		Emitter.emit( "lightColorUpdate", lightColor );

	}

}