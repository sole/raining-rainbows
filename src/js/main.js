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
	c.x = 200;
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
		this.rainbow = { x: 0, height: 0, dstHeight: 1 };

		var rainbowTween = new TWEEN.Tween(this.rainbow)
			.to({ height: this.rainbow.dstHeight }, 500)
			.easing(TWEEN.Easing.Exponential.In);
			
		var bubbleRadius = 50;
		var numBubbles = 5; // Math.max(5, Math.round(9 * Math.random()));

		var distance = bubbleRadius * 4;
		var offsetX = -distance / 2;
		var incX = distance / (numBubbles - 1);
		
		this.rainbow.width = distance * 0.6;
		this.rainbow.x = - this.rainbow.width * 0.5;
		
		var minBubbleRadius = 20;

		
		for(var i = 0; i < numBubbles; i++) {
			var bubble =  {
				x: offsetX,
				y: Math.random() * bubbleRadius / 2,
				radius: 0,
				//dstRadius: Math.max(minBubbleRadius, Math.random() * bubbleRadius)
				dstRadius: bubbleRadius / 4
			};

			var bubbleTween = new TWEEN.Tween(bubble)
				.to({ radius: bubble.dstRadius }, 1000)
				.easing(TWEEN.Easing.Exponential.InOut)
				.delay(i * 200)
				.start();
			
			this.bubbles.push(bubble);

			if(i + 1 == numBubbles) {
				bubbleTween.chain(rainbowTween);
			}

			offsetX += incX;
		}

		this.render = function(ctx) {
			
			var ox = this.x;
			var oy = this.y;

			ctx.fillStyle = 'red';
			if(this.rainbow.height > 0) {
				var rainbowOrigin = ox + this.rainbow.x;
				var rainbowWidth = this.rainbow.width;
				var rainbowHeight = (canvas.height - oy) * this.rainbow.height;
				var rainbowGradient = ctx.createLinearGradient(rainbowOrigin, oy, rainbowOrigin + rainbowWidth, oy);
				rainbowGradient.addColorStop(0, 'red');
				rainbowGradient.addColorStop(0.2, 'red');
				rainbowGradient.addColorStop(0.21, 'orange');
				rainbowGradient.addColorStop(0.4, 'orange');
				rainbowGradient.addColorStop(0.41, 'yellow');
				rainbowGradient.addColorStop(0.6, 'yellow');
				rainbowGradient.addColorStop(0.61, '#0f0');
				rainbowGradient.addColorStop(0.8, '#0f0');
				rainbowGradient.addColorStop(0.81, '#1D74FE');
				rainbowGradient.addColorStop(1, '#1D74FE');

				ctx.fillStyle = rainbowGradient;

				ctx.beginPath();
				ctx.fillRect(rainbowOrigin, oy, rainbowWidth, rainbowHeight);
			}

			this.bubbles.forEach(function(b) {

				var px = ox + b.x;
				var py = oy + b.y;
				var gradient = ctx.createRadialGradient(px, py, 0, px, py, b.radius);

				gradient.addColorStop(0, '#8C8F92');
				gradient.addColorStop(1, '#5C5C5E');
				
				ctx.fillStyle = gradient;

				ctx.beginPath();
				ctx.arc(px, py, b.radius, 0, 2 * Math.PI, false);
				ctx.fill();
				
			});


			/* debug
			ctx.fillStyle = '#ff00ff';
			ctx.beginPath();
			ctx.fillRect(ox, oy, 10, 10);
			ctx.fill();
			*/
		};

	}

	

};
