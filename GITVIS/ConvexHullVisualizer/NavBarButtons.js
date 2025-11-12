function CreateAutoPoint(x, y){	
	var newPoint = new Point(x, y);
	points.push(newPoint);

	//make html object
	var node = document.createElement("div"); 
	node.className = "point"
	node.style.left = x + "px";
	node.style.top = y + "px";
	document.body.append(node);  

	//add to dictionary for "cross" access
	point_html.set(newPoint, node);
	html_point.set(node, newPoint);

	AnimatePoint(node);
}

function clearNodes(){
	//Stop any running animation
	shouldStopAnimation = true;
	isRunning = false;
	
	//remove html objects
	$('.point').remove();
	$('.point-hull').remove();
	$('.line').remove();
	$('.temp-line').remove();

	//remove from list
	html_point = new WeakMap();
	point_html = new WeakMap();
	points = [];
	hull = [];
	UpdatePointCounters();
	EnableButtons();
	hideStats();
}

function removeHull(){
	//Stop any running animation
	shouldStopAnimation = true;
	isRunning = false;
	
	$('.line').remove();
	$('.temp-line').remove();
	var hull_points = $('.point-hull');
	for(var i = 0; i<hull_points.length; i++){
		AnimatePoint(hull_points[i]);
		hull_points[i].setAttribute("class", "point");
		points.push(html_point.get(hull_points[i]));
		hull = [];
	}
	UpdatePointCounters();
	EnableButtons();
	hideStats();
}

function randomPoints(){
	// Get the number of points from the input field, default to 20 if not specified
	var numPointsInput = document.getElementById("numPointsToGenerate");
	var n = numPointsInput ? parseInt(numPointsInput.value) || 20 : 20;
	
	// Ensure n is within reasonable bounds
	n = Math.max(1, Math.min(n, 100));
	
	let canvas = document.getElementById("sandbox").getBoundingClientRect();
	let offset = 100;
	//boundaries
	x_min = canvas.left + offset;
	x_max = canvas.left + canvas.width - 2 * offset;

	y_min = canvas.top + 0.5*offset;
	y_max = canvas.top + canvas.height - 2 * offset;
 
	for(var i = 0; i<n; i++){
		var pos_x = Math.random() * x_max + x_min;
		var pos_y = Math.random() * y_max + y_min;
		CreateAutoPoint(pos_x, pos_y);
	}
	UpdatePointCounters();
}
