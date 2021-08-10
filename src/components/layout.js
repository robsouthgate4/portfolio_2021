import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby";
import styled, { createGlobalStyle } from "styled-components";



const ListLink = props => (

	<li style={{ display: `inline-block`, marginRight: `1rem` }}>
		<Link to={props.to}>{props.children}</Link>
	</li>

)

const Layout = ( { children } ) => {

	const data = useStaticQuery(
		graphql`
		  query {
			site {
			  siteMetadata {
				title
				name
			  }
			}
		  }
		`
	)

	const GlobalStyle = createGlobalStyle`
		@import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');
		body {
			box-sizing: border-box;
			color: ${props => (props.theme === "purple" ? "purple" : "white")};
		}
		.guify-container_be6yU {
			//display: none;
		}
	`

	const Header = styled.header`
		display: flex;
		justify-content: flex-start;
		position: absolute; 
		color: white; 
		top: 0; 
		left: 0; 
		width: 100%;
		padding-top: 60px;
		padding-left: 60px;
		margin-bottom: 1.5rem; 
		box-sizing: border-box;
		z-index: 1;
		text-align: left;
		h2, h3 {
			margin: 0;
			font-family: 'Quicksand', sans-serif;
			font-weight: 300;
		}
		h2 {
			margin-bottom: 10px;
		}
		a {

			color: white;
			text-decoration: none;

		}
	`;

	return (

		<div>
				<GlobalStyle theme="white" />

				<Header>

					<Link to="/" style={{ textShadow: `none`, backgroundImage: `none` }}>
						<h2 style={{ display: `block` }}>{data.site.siteMetadata.name}</h2>
						<h3 style={{ display: `block` }}>{data.site.siteMetadata.title}</h3>
					</Link>

					{/* <ul style={{ listStyle: `none`, float: `right`, color: `white`, }}>
						<ListLink to="/">Home</ListLink>
						<ListLink to="/about/">About</ListLink>
					</ul> */}

				</Header>

				{children}

		</div>
	);

}

export default Layout;