

export const isTouchDevice = () => {

	return (('ontouchstart' in window) ||
			window.DocumentTouch &&
			document instanceof window.DocumentTouch) ||
			navigator.msMaxTouchPoints ||
			false;

}

export const isMobile =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

window.DEBUG = false;