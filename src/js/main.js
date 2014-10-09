window.onload = function() {
	
	var canvas;
	var clouds = [];


	canvas = document.createElement('canvas');

	window.addEventListener('resize', updateCanvasSize);

	updateCanvasSize();

	//

	function updateCanvasSize() {
		var w = window.innerWidth;
		var h = window.innerHeight;

		canvas.width = w;
		canvas.height = h;
	}

	function makeCloud() {
	}

	function render(t) {

		requestAnimationFrame(render);
		TWEEN.update(t);

		
	
	}



};
