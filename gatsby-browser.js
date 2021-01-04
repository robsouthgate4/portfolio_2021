import React 	from "react";
import Layout 	from "./src/components/layout";
import WebGL 	from "./src/components/webgl";

export const wrapPageElement = ({ element, props }) => {

  return (
	<div className={"site-container"}>
		<Layout {...props}>{element}</Layout>
		<WebGL {...props}></WebGL>
	</div>
  );
  	
}