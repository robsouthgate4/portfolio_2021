/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

const path = require('path');

module.exports = {

	siteMetadata: {
		name: `Robert Southgate`,
		title: `Creative Technologist`,
	},

	plugins: [
		{
			resolve: `gatsby-plugin-alias-imports`,
			options: {
				extensions: [".js"],
				alias: {
					Assets : path.resolve(__dirname, "static/assets/"),
					Common : path.resolve(__dirname, "./src/webgl/common/"),
					Globals: path.resolve(__dirname, "./src/webgl/globals/")
				}
			}
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `src`,
				path: `${__dirname}/src/`,
			}
		},
		`gatsby-plugin-styled-components`,
		`gatsby-plugin-glslify`,
		`gatsby-transformer-remark`
	]

}
