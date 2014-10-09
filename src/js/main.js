window.onload = function() {
	
	var canvas;
	var context;
	var clouds = [];

	canvas = document.createElement('canvas');
	context = canvas.getContext('2d');

	document.body.appendChild(canvas);

	window.addEventListener('resize', updateCanvasSize);

	updateCanvasSize();

	var c = makeCloud();
	// TMP
	c.x = 0;
	c.y = 0;

	requestAnimationFrame(render);

	//

	function updateCanvasSize() {
		var w = window.innerWidth;
		var h = window.innerHeight;

		canvas.width = w;
		canvas.height = h;
	}

	function makeCloud() {
		var x = Math.random() * canvas.width;
		var y = Math.random() * canvas.height;
		console.log('cloud at', x, y);
		var cloud = new Cloud();
		cloud.x = x;
		cloud.y = y;

		clouds.push(cloud);

		return cloud;
	}

	function render(t) {

		requestAnimationFrame(render);
		TWEEN.update(t);
		
		context.clearRect(0, 0, canvas.width, canvas.height);

		clouds.forEach(function(c) {
			c.render(t, context);
		});
	
	}


	function Cloud() {

		this.x = 0;
		this.y = 0;

		var self = this;
	
		this.render = function(time, ctx) {
			ctx.fillStyle = '0x666666';
			ctx.fillRect(self.x, self.y, 10, 10);
		};

	}

	

};
