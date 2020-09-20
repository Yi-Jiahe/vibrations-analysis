import * as math from 'mathjs';

const frequencies = [7.770880361057125, 17.493866771407347, 28.286417839245907, 35.018546780517106, 60.86390485413846];
const modeshapes = [
	[0.028385571503446377, -0.049982173081463785, 0.07822616568264121, -0.007166412583523699, 0.9962196945812942],
	[0.25126552313780454, -0.4123184658595363, 0.550504288222691, -0.04294079120943411, -0.08641682244730706],
	[0.4183173152492069, -0.3103700521634229, -0.5978949836835116, 0.1150368527590084, 0.008818071282975402],
	[0.5933126012761663, 0.4575749337258712, 0.024038371112877807, -0.4212287825320698, -0.0008002097209676965],
	[0.6395706975325813, 0.7223509367552116, 0.5768617172697053, 0.8985752980439886, 0.00023282979680741176]
];

var xScale = 10;
var yScale = 10;

let modeshapesPlot = document.getElementById('modeshapes');
var data = [];
for (var i = 0; i < 5; i++) {
	let modeshape = [];
	for (var j = 0; j < 5; j++) {
		modeshape.push(modeshapes[j][i]);
	}
	data.push({
		x: [1, 2, 3, 4, 5],
		y: modeshape,
		mode: 'lines+markers',
		marker: {
			size: 15
		},
		line: {
			dash: 'dot',
			width: 2
		},
		name: `Mode ${i+1}`
	})
}
Plotly.newPlot(modeshapesPlot, data);

/*computes control points given knots K, this is the brain of the operation*/
function computeControlPoints(K) {
	let p1 = new Array();
	let p2 = new Array();
	const n = K.length - 1;

	/*rhs vector*/
	let a = new Array();
	let b = new Array();
	let c = new Array();
	let r = new Array();

	/*left most segment*/
	a[0] = 0;
	// b[0] = 2;
	b[0] = 1;
	// c[0] = 1;
	c[0] = 0;	
	// r[0] = K[0] + 2 * K[1];
	r[0] = K[0];

	/*internal segments*/
	for (var i = 1; i < n - 1; i++) {
		a[i] = 1;
		b[i] = 4;
		c[i] = 1;
		r[i] = 4 * K[i] + 2 * K[i + 1];
	}

	/*right segment*/
	a[n - 1] = 2;
	b[n - 1] = 7;
	c[n - 1] = 0;
	r[n - 1] = 8 * K[n - 1] + K[n];

	/*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
	for (var i = 1; i < n; i++) {
		const m = a[i] / b[i - 1];
		b[i] = b[i] - m * c[i - 1];
		r[i] = r[i] - m * r[i - 1];
	}

	p1[n - 1] = r[n - 1] / b[n - 1];
	for (i = n - 2; i >= 0; --i)
		p1[i] = (r[i] - c[i] * p1[i + 1]) / b[i];

	/*we have p1, now compute p2*/
	for (i = 0; i < n - 1; i++)
		p2[i] = 2 * K[i + 1] - p1[i + 1];

	p2[n - 1] = 0.5 * (K[n] + p1[n - 1]);

	return {
		p1: p1,
		p2: p2
	};
}

function generateSplinePath_d(xArray, yArray) {
	let x = [...xArray];
	let y = [...yArray];
	x.unshift(0);
	y.unshift(50);
	console.log(`x: ${x}`);
	console.log(`y: ${y}`);

	/*computes control points p1 and p2 for x and y direction*/
	const px = computeControlPoints(x);
	const py = computeControlPoints(y);
	// console.log(`px: ${px}`);
	// console.log(`py: ${py}`);
	console.log(px);
	console.log(py);

	let d = `M ${x[0]},${y[0]}`

	/*updates path settings, the browser will draw the new spline*/
	for (i = 0; i < x.length - 1; i++) {
		d += ` C ${px.p1[i]},${py.p1[i]} ${px.p2[i]},${py.p2[i]} ${x[i+1]},${y[i+1]}`;
	}

	return d
}

function calculate_path_d(points) {
	var d = 'M 0,50';
	d += ` Q ${points[0][0]/2},${(points[0][1]+50)/2} ${points[0][0]},${points[0][1]}`;
	for (var i = 1; i < points.length; i++) {
		d += ` T ${points[i][0]},${points[i][1]}`;
	}
	return d;
}

// Set up SVG display element
const targetDiv = document.getElementById('svg-target');
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgNode.style.width = '100%';
targetDiv.appendChild(svgNode);

// Create SVGs for the masses
const xPositions = [3.0, 9.0, 15.0, 22.50, 30];
var initial_displacements = [0, 0, 0, 0, 0];
const masses = [4000, 6000, 5000, 3000, 1000];
var svgMasses = [];
for (var i = 0; i < 5; i++) {
	// create the circle node, set attributes, and append it to the SVG node
	const circleNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	circleNode.setAttributeNS(null, 'cx', xPositions[i] * xScale);
	circleNode.setAttributeNS(null, 'cy', '50');
	circleNode.setAttributeNS(null, 'r', Math.pow(masses[i], 1 / 3));
	circleNode.setAttributeNS(null, 'fill', 'black');
	svgNode.appendChild(circleNode);
	svgMasses.push(circleNode);
}
const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
// path.setAttributeNS(null, 'd', calculate_path_d(xPositions.map(function(e, i) {return [e*xScale, 50-initial_displacements[i]*yScale]})));
path.setAttributeNS(null, "d", generateSplinePath_d(xPositions.map(function (e, i) {
		return e * xScale
	}),
	initial_displacements.map(function (e, i) {
		return 50 - e * yScale
	})));
path.setAttributeNS(null, "stroke", "black");
path.setAttributeNS(null, "stroke-width", 7);
path.setAttributeNS(null, "opacity", 1);
path.setAttributeNS(null, "fill", "none");
svgNode.appendChild(path);


function set_mass_displacements(displacements) {
	for (var i = 0; i < 5; i++) {
		svgMasses[i].setAttributeNS(null, 'cy', 50 - displacements[i] * yScale);
	}
	// const points = xPositions.map(function(e, i) {return [e*xScale, 50-displacements[i]*yScale]});
	// path.setAttributeNS(null, 'd', calculate_path_d(points));
	path.setAttributeNS(null, "d", generateSplinePath_d(xPositions.map(function (e, i) {
		return e * xScale
	}), displacements.map(function (e, i) {
		return 50 - e * yScale
	})));
}

let constants = [0, 0, 0, 0, 0];
const submitButton = document.getElementById('submit');
submitButton.disabled = false;
document.getElementById('initial_displacements').addEventListener('submit', function (e) {
	e.preventDefault(); //to prevent form submission
	play_animation = false;
	for (var i = 0; i < 5; i++) {
		initial_displacements[i] = document.getElementsByClassName('y0_input')[i].value;
	}
	set_mass_displacements(initial_displacements);
	constants = solve_for_constants(initial_displacements);

	timeScale = document.getElementById('speed').value * 0.01;
});

let buttonState = 'start';
const animation_button = document.getElementById('animation_control');
animation_button.addEventListener('click', function () {
	switch (buttonState) {
		case 'start':
			play_animation = true;
			animate();
			buttonState = 'stop';
			animation_button.innerText = 'Stop Animation';
			submitButton.disabled = true;
			break;
		case 'stop':
			play_animation = false;
			buttonState = 'reset';
			animation_button.innerText = 'Reset Animation';
			submitButton.disabled = false;
			break;
		case 'reset':
			set_mass_displacements(initial_displacements);
			buttonState = 'start';
			animation_button.innerText = 'Start Animation';
			break;
	}
});

function solve_for_constants(initial_displacements) {
	// Assume zero initial velocity => alphas are pi/2
	return math.multiply(math.inv(modeshapes), initial_displacements);
}

// let constants = solve_for_constants([-0.049982173081463646, -0.4123184658595355, -0.3103700521634221, 0.45757493372587194, 0.7223509367552119])

function y(t) {
	let modeAmplitudes = []
	for (var i = 0; i < 5; i++) {
		modeAmplitudes.push(constants[i] * math.cos(frequencies[i] * t))
	}
	return math.multiply(modeshapes, modeAmplitudes);
}

var play_animation = false;
var timeScale = 0.1;
const animate = () => {
	let startTime = 0;
	const animateStep = (timestamp) => {
		if (!startTime) startTime = timestamp;
		const t = (timestamp - startTime) / (1000 / timeScale);
		console.log(t);
		const yPositions = y(t);
		set_mass_displacements(yPositions);
		if (play_animation) {
			window.requestAnimationFrame(animateStep);
		}
	}
	window.requestAnimationFrame(animateStep);
};