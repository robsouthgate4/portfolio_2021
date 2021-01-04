exports.onCreateWebpackConfig = ({
	stage,
	rules,
	loaders,
	plugins,
	actions, }) => {

	actions.setWebpackConfig({
		module: {
			rules: [
				{
					test: /\.(glb|gltf|hdr)$/i,
					loader: 'file-loader'
				}
			]
		}
	})

}