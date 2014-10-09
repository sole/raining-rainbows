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
	c.x = 50;
	c.y = 50;

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
			c.render(context);
		});
	
	}


	function Cloud() {

		this.x = 0;
		this.y = 0;

		this.bubbles = [];

		var bubbleRadius = 75;
		var numBubbles = Math.round(5 * Math.random());

		for(var i = 0; i < numBubbles; i++) {
			var bubble =  {
				x: Math.random() * bubbleRadius * 2,
				y: Math.random() * bubbleRadius / 2,
				radius: 0,
				dstRadius: Math.random() * bubbleRadius
			};

			var bubbleTween = new TWEEN.Tween(bubble)
				.to({ radius: bubble.dstRadius }, 1000)
				.easing(TWEEN.Easing.Exponential.InOut)
				.delay(i * 100)
				.start();
			
			this.bubbles.push(bubble);
		}

		this.render = function(ctx) {
			ctx.fillStyle = '0x666666';
			
			var ox = this.x;
			var oy = this.y;

			this.bubbles.forEach(function(b) {
				ctx.beginPath();
				ctx.arc(ox + b.x, oy + b.y, b.radius, 0, 2 * Math.PI, false);
				ctx.fill();
			});
		};

	}

	

};
