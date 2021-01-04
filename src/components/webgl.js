import React, { useState, useEffect, useRef } from "react";
import GL from "../webgl/index";

import * as THREE from "three"
window.THREE = THREE;


const WebGL = ( { location } ) => {

	const refContainer = useRef( null );
	const videoRef1	   = useRef( null );
	const videoRef2	   = useRef( null );
	const videoRef3	   = useRef( null );

	const [ gl, setGL ] = useState( null );

	useEffect( () => {

		// initialise gl state once

		const gl = new GL( { 
			parent:  refContainer.current,
			video1:  videoRef1.current,
			video2:  videoRef2.current,
			video3:  videoRef3.current
		} );

		gl.start();

		setGL( gl );		

	}, [] );

	useEffect( () => {

		// handle routing updates

		if ( !gl ) return;

		const { pathname } = location;

		gl.handlePageIn( pathname );

		return () => {

			gl.handlePageOut( pathname );

		}

	}, [ gl, location ]);

	return (
			<div
			ref={ refContainer }
			style={{ 
				width: `100vw`, 
				height: `100vh`, 
				position: `fixed`,
				top: 0,
				left:0,
				zIndex: 0 }}>

				<video id={ "video1" } 
				ref={ videoRef1 } 
				style={{display: "none", position: "absolute", left: 0, bottom: 0, width: "20%", hight: "20%", opacity: 0.8, top: 0, left: 0}} 
				muted
				playsInline
				autoPlay
				loop>
					<source src="/assets/videos/mustang.mp4" type="video/mp4"></source>
				</video>

				<video id={ "video2" } 
				ref={ videoRef2 } 
				style={{display: "none", position: "absolute", left: 0, bottom: 0, width: "20%", hight: "20%", opacity: 0.8, top: 0, left: 0}} 
				muted
				playsInline
				autoPlay
				loop>
					<source src="/assets/videos/tomorrowland.mp4" type="video/mp4"></source>
				</video>

				<video id={ "video3" } 
				ref={ videoRef3 } 
				style={{display: "none", position: "absolute", left: 0, bottom: 0, width: "20%", hight: "20%", opacity: 0.8, top: 0, left: 0}} 
				muted
				playsInline
				autoPlay
				loop>
					<source src="/assets/videos/caracciola.mp4" type="video/mp4"></source>
				</video>

				

			</div>
		)
}


export default WebGL;