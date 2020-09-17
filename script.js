import * as math from 'mathjs';

const frequencies = [17.376272432753073, 39.11760068339389, 63.250555880976044, 78.30410208176147, 136.09626489254052];

const modeshapes = 
	[[0.028385571503446397, -0.049982173081463646, 0.07822616568264114, -0.007166412583523741, 0.9962196945812942],
	 [0.25126552313780465, -0.4123184658595355, 0.5505042882226907, -0.0429407912094344, -0.08641682244730707],
	 [0.4183173152492066, -0.3103700521634221, -0.5978949836835116, 0.11503685275900873, 0.0088180712829754],
	 [0.5933126012761664, 0.45757493372587194, 0.024038371112877977, -0.42122878253207, -0.0008002097209676959],
	 [0.6395706975325814, 0.7223509367552119, 0.5768617172697054, 0.8985752980439886, 0.0002328297968074114]];

let constants = [0, 0, 0, 0, 0];
document.getElementById('initial_displacements').addEventListener('submit', function(e) {
	e.preventDefault(); //to prevent form submission
	const initial_displacments = 
	[document.getElementById('y0_1').value,
	 document.getElementById('y0_2').value,
	 document.getElementById('y0_3').value,
	 document.getElementById('y0_4').value,
	 document.getElementById('y0_5').value];
	constants = solve_for_constants(initial_displacments);
	// alert(constants);
});

// Assume zero initial velocity => alphas are pi/2
function solve_for_constants(initial_displacments){
	return math.multiply(math.inv(modeshapes), initial_displacments);
}

// let constants = solve_for_constants([-0.049982173081463646, -0.4123184658595355, -0.3103700521634221, 0.45757493372587194, 0.7223509367552119])

function y(t){
	let modeAmplitudes = []
	for (var i = 0; i < 5; i++){
		modeAmplitudes.push(constants[i] * math.sin(frequencies[i]*t))
	}
	return math.multiply(modeshapes, modeAmplitudes);
}

// Set up SVG display element
const targetDiv = document.getElementById('svg-target');
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgNode.setAttributeNS(null, 'viewBox', `0 0 ${targetDiv.clientWidth} 100`);
targetDiv.appendChild(svgNode);

// Create SVGs for the masses
const xPositions = [3.0, 9.0, 15.0, 22.50, 30];
const masses = [4000, 6000, 5000, 3000, 1000];
var svgMasses = [];
for (var i = 0; i < 5; i++){
	// create the circle node, set attributes, and append it to the SVG node
	const circleNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	circleNode.setAttributeNS(null, 'cx', xPositions[i] * 10);
	circleNode.setAttributeNS(null, 'cy', '50');
	circleNode.setAttributeNS(null, 'r', Math.pow(masses[i], 1/3));
	circleNode.setAttributeNS(null, 'fill', 'black');
	svgNode.appendChild(circleNode);
	svgMasses.push(circleNode);
}

var speed = 0.1;
const animate = () => {
	let startTime = 0;
	const animateStep = (timestamp) => {
		if (!startTime) startTime = timestamp;
		// progress goes from 0 to 1 over 1s
		const t = (timestamp - startTime);
		const yPositions = y((timestamp - startTime)/(1000/speed));
		// console.log(yPositions);
		for (var i = 0; i < 5; i++){
			svgMasses[i].setAttributeNS(null, 'cy', 50 + yPositions[i]*10);
		}		
		window.requestAnimationFrame(animateStep);  
	}
	window.requestAnimationFrame(animateStep);
};

animate();