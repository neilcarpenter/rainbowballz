var params, ctx, winWidth, winHeight;

var rainbowBallz = function() {

	var canvas = document.createElement('canvas');
		
	winWidth = window.innerWidth;
	winHeight = window.innerHeight;

	canvas.width = winWidth;
	canvas.height = winHeight;

	document.body.appendChild(canvas);

	var c = document.getElementsByTagName('canvas')[0];
	
	ctx = c.getContext('2d');

	var	CANVAS_PADDING = 20,
		clearing = false,
		xCounter = 0,
		yCounter = 0,
		itemWidth,
		rows,
		itemCount,
		hueIncrement,
		satIncrement,
		rMax,
		hue,
		sat,
		x,
		y,
		mouseX = null,
		mouseY = null;

	function refresh(params) {
		var strength, dist;

		itemWidth = (winWidth - (CANVAS_PADDING * 2)) / params.COLS,
		rows = winHeight / itemWidth,
		itemCount = params.COLS * rows,
		hueIncrement = Math.floor(360 / rows),
		satIncrement = Math.floor(100 / params.COLS),
		rMax = ((itemWidth - 4) / 2) + params.MIN_RADIUS;

		if (clearing) {
			ctx.clearRect(0, 0, winWidth, winHeight);
		}

		for (var i = 0; i < itemCount; i++) {

			if (i !== 0 && i % params.COLS === 0) {
				xCounter = 0;
				yCounter += 1;
			}

			hue = hueIncrement * yCounter;
			sat = satIncrement * xCounter;

			x = (CANVAS_PADDING + (xCounter * itemWidth)) + params.MIN_RADIUS + (rMax - params.MIN_RADIUS);
			y = (CANVAS_PADDING + (yCounter * itemWidth)) + params.MIN_RADIUS + (rMax - params.MIN_RADIUS);

			if (mouseX) {
				dist = Math.sqrt( Math.pow((x-mouseX),2) + Math.pow((y-mouseY),2));

				if (dist >= params.MOUSE_RADIUS) {
					r = params.MIN_RADIUS;
					ctx.lineWidth = params.LINE_WIDTH;
				}
				else {
					strength = (params.MOUSE_RADIUS - dist) / params.MOUSE_RADIUS;
					r = ((strength * rMax) * params.EFFECT_STRENGTH) + params.MIN_RADIUS;
					ctx.lineWidth = (strength * 1) + params.LINE_WIDTH;
				}
			}
			else {
				r = params.MIN_RADIUS;
				ctx.lineWidth = params.LINE_WIDTH;
			}

			drawThatShit(hue, sat, x, y, r);

			xCounter += 1;

		}

		xCounter = 0;
		yCounter = 0;
	}

	function drawThatShit (hue, sat, x, y, r) {
		ctx.strokeStyle = 'hsl(' + hue + ', ' + sat + '%, 50%)';
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI*2, true);
		ctx.stroke();
	}

	function mouse (e) {
		mouseX = e.pageX;
		mouseY = e.pageY;
	}

	function toggleClear () {
		clearing = clearing ? false : true;
	}

	c.addEventListener('mousemove', mouse, false);
	c.addEventListener('mouseup', toggleClear, false);

	setInterval(function() {
		refresh(params);
	}, 1000/60);

};

function eventListenerz() {
	var inputs = document.getElementsByClassName('controller');

	function onChange() {
		var name = this.name,
			value = this.value,
			max = this.getAttribute('max');

		value = +value;
		ctx.clearRect(0, 0, winWidth, winHeight);

		if (value > max) {
			value = max;
			this.value = max;
		}

		params[name] = value;

	}

	for (var i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('change', onChange, false);
	}

	var controlToggles = document.getElementsByClassName('toggle-controls'),
		controls = document.getElementById('controls');

	function toggleControls(e) {
		e.preventDefault();
		controls.className = controls.className === 'closed' ? '' : 'closed';
	}

	for (var j = 0; j < 2; j++) {
		controlToggles[j].addEventListener('click', toggleControls, false);
	}

}

window.onload = function() {

	params = {
		COLS : 50, 				// maybe 5 - 70
		MOUSE_RADIUS : 200, 	// 100 - 1000
		MIN_RADIUS : 0.5, 		// 0 - 100
		LINE_WIDTH : 1, 		// 1 - 5
		EFFECT_STRENGTH : 2 	// 1 - 20
	};

	rainbowBallz();

	eventListenerz();
};