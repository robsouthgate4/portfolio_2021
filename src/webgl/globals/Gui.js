import guify from "guify"

class Gui extends guify{

	constructor() {

		super( {

			title: "Portfolio 2021",
			align: 'right',
			theme: 'dark',
			panelMode: "inner",
			open: false
			
		} );

	}

}

export default new Gui();