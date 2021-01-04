
import FBOHelper from "Common/libs/THREE.FBOHelper";
import Renderer  from "Globals/Renderer";

class FBOUtil {

	constructor() {

		this.helper = new FBOHelper( Renderer );

	}

}

export default new FBOUtil().helper;
