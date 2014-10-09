window.onload = function() {
	
	var canvas;
	var context;
	var clouds = [];
	var cloudDelay = 5000;

	canvas = document.createElement('canvas');
	context = canvas.getContext('2d');

	document.body.appendChild(canvas);

	window.addEventListener('resize', updateCanvasSize);

	updateCanvasSize();


	// set initial cloud in the middle
	var c = makeCloud();
	c.x = Math.round(canvas.width * 0.5);

	for(var i = 0; i < 5; i++) {
		c = makeCloud(cloudDelay * (i + 1));
		c.x = canvas.width + c.width * (i + 1);
	}
	
	requestAnimationFrame(render);

	//

	function updateCanvasSize() {
		var w = window.innerWidth;
		var h = window.innerHeight;

		canvas.width = w;
		canvas.height = h;

		console.log('canvas size', canvas.width, canvas.height);
	}

	function makeCloud(delay) {

		delay = delay !== undefined ? delay : 0;
		
		var x = canvas.width;
		var y = (0.15 + Math.random()) * canvas.height * 0.25;
		var cloud = new Cloud(delay);
		
		cloud.x = x + cloud.width;
		cloud.y = y;
		cloud.speed = 25 + 25 * Math.random();

		clouds.push(cloud);

		return cloud;
		
	}


	var lastRenderTime = 0;

	function render(t) {

		requestAnimationFrame(render);
		TWEEN.update(t);
		
		var elapsed = (t - lastRenderTime) * 0.001;

		context.clearRect(0, 0, canvas.width, canvas.height);

		clouds.forEach(function(c) {
			c.render(context);
			c.x -= elapsed * c.speed;
		});


		var i = 0;
		var numDead = 0;

		while(i < clouds.length) {
			
			var c = clouds[i];

			if(c.x + c.width < 0) {
				clouds.splice(i, 1);
				numDead++;
			}

			i++;
		}

		for(i = 0; i < numDead; i++) {
			var newC = makeCloud(cloudDelay * ( 1 + i ));
			newC.x = canvas.width + newC.width * (i +1);
		}

		lastRenderTime = t;
	
	}


	function Cloud(delay) {

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
		var angleInc = 2 * Math.PI / numBubbles;
		var angle = Math.PI * 2 * Math.random();
		var cloudRadiusX = distance / 3;
		var cloudRadiusY = distance / 7;
		
		this.width = distance + bubbleRadius;
		this.rainbow.width = distance * 0.6;
		this.rainbow.x = - this.rainbow.width * 0.5;
		
		var minBubbleRadius = 20;

		for(var i = 0; i < numBubbles; i++) {

			var bx = cloudRadiusX * Math.sin(angle);
			var by = cloudRadiusY * Math.cos(angle);

			var bubble =  {
				x: bx,
				y: by,
				radius: 0,
				dstRadius: (1 - Math.abs(bx) / distance) * bubbleRadius + Math.random() * bubbleRadius * 0.25
			};

			var bubbleTween = new TWEEN.Tween(bubble)
				.to({ radius: bubble.dstRadius }, 1000)
				.easing(TWEEN.Easing.Exponential.InOut)
				.delay(delay + i * 200)
				.start();
			
			this.bubbles.push(bubble);

			if(i + 1 == numBubbles) {
				bubbleTween.chain(rainbowTween);
			}

			offsetX += incX;
			angle += angleInc;
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
