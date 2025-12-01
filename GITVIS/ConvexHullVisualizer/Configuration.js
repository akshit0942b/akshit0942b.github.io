let isRunning = false;
let shouldStopAnimation = false;
let computationStartTime = 0;
let computationEndTime = 0;

function showStats(algorithmName, timeTaken, pointsProcessed, hullSize, area, perimeter) {
	var statsBar = document.getElementById('statsBar');
	var statsAlgorithm = document.getElementById('statsAlgorithm');
	var statsTime = document.getElementById('statsTime');
	var statsPoints = document.getElementById('statsPoints');
	var statsArea = document.getElementById('statsArea');
	var statsPerimeter = document.getElementById('statsPerimeter');
	
	statsAlgorithm.textContent = 'Algorithm: ' + algorithmName;
	statsTime.textContent = 'Computation Time: ' + timeTaken.toFixed(3) + ' ms';
	statsPoints.textContent = 'Points: ' + pointsProcessed + ' | Hull: ' + hullSize;
	if (area !== undefined && perimeter !== undefined) {
		statsArea.textContent = 'Area: ' + area.toFixed(2);
		statsPerimeter.textContent = 'Perimeter: ' + perimeter.toFixed(2);
	} else {
		statsArea.textContent = '';
		statsPerimeter.textContent = '';
	}
	
	statsBar.className = 'visible';
	
	// Auto-hide after 10 seconds
	setTimeout(function() {
		statsBar.className = '';
	}, 10000);
}

function hideStats() {
	var statsBar = document.getElementById('statsBar');
	statsBar.className = '';
}

async function GenerateHullDirectly(){
	//Same as Visualize but without animations
	Reset();

	if(isRunning){
		return;
	}

	//check for errors
	if(currentSelected == ""){
		//error: nothing selected
		document.getElementById("actualGenerateButton").innerHTML = "Pick an Algorithm";
		setTimeout(function(){ 
			document.getElementById("actualGenerateButton").innerHTML = "Generate Hull";
		}, 2000);
		return;
	}

	if($('.point').length < 3){
		return;
	}

	isRunning = true;
	shouldStopAnimation = false;
	DisableButtons();

	//Temporarily set speed to Super Sonic to skip animations
	var originalSpeed = currentSelectedSpeed;
	currentSelectedSpeed = 'Super Sonic';
	
	// Start timing
	var totalPoints = $('.point').length;
	computationStartTime = performance.now();

	switch(currentSelected) {
		case "Jarvis March":
			await ConvexHull_JarvisMarch();
    			break;
		case "Graham Scan":
			await ConvexHull_GrahamScale();
    			break;
    		case "Quickhull":
    			await ConvexHull_Quickhull();
    			break;
		case "DAC":
			await ConvexHull_DAC();
    			break;
		case "Monotone Chain":
			await ConvexHull_MonotoneChain();
    			break;
		default:
    			break;
	}
	
	// End timing and show stats
	computationEndTime = performance.now();
	var timeTaken = computationEndTime - computationStartTime;
	var hullSize = hull.length;
	var area = calculatePolygonArea(hull);
	var perimeter = calculatePolygonPerimeter(hull);
	
	showStats(currentSelected, timeTaken, totalPoints, hullSize, area, perimeter);

	//Restore original speed
	currentSelectedSpeed = originalSpeed;
	UpdatePointCounters();
}

function calculatePolygonArea(points) {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
        let j = (i + 1) % points.length;
        area += points[i].x * points[j].y;
        area -= points[j].x * points[i].y;
    }
    return Math.abs(area) / 2;
}

function calculatePolygonPerimeter(points) {
    let perimeter = 0;
    for (let i = 0; i < points.length; i++) {
        let j = (i + 1) % points.length;
        let dx = points[j].x - points[i].x;
        let dy = points[j].y - points[i].y;
        perimeter += Math.sqrt(dx * dx + dy * dy);
    }
    return perimeter;
}

async function Visualize(){
	//all points get resetted: point-hull -> point
	//points array reset
	//WeakMaps are not modified
	Reset();
	hideStats();

	if(isRunning){
		return;
	}

	//check for errors
	if(currentSelected == ""){
		//error: nothing selected
		document.getElementById("actualStartButton").innerHTML = "Pick an Algorithm";
		return;
	}

	if($('.point').length < 3){
		return;
	}


	//false when algorithm is finished
	//set false by Algorithm function itself (not here)
	isRunning = true;
	shouldStopAnimation = false;

	//navbar buttons get red
	DisableButtons();

	// Start timing
	computationStartTime = performance.now();

	switch(currentSelected) {
		case "Jarvis March":
			await ConvexHull_JarvisMarch();
    			break;
		case "Graham Scan":
			await ConvexHull_GrahamScale();
    			break;
    		case "Quickhull":
    			await ConvexHull_Quickhull();
    			break;
		case "DAC":
			await ConvexHull_DAC();
    			break;
		case "Monotone Chain":
			await ConvexHull_MonotoneChain();
    			break;
		default:
    			break;
	}

	// End timing and show stats
	computationEndTime = performance.now();
	var timeTaken = computationEndTime - computationStartTime;
	var hullSize = hull.length;
	var totalPoints = $('.point').length;
	var area = calculatePolygonArea(hull);
	var perimeter = calculatePolygonPerimeter(hull);
	
	showStats(currentSelected, timeTaken, totalPoints, hullSize, area, perimeter);

	UpdatePointCounters();
}

function Reset(){
	//make hull points -> normal points
	var hullpoints = document.querySelectorAll(".point-hull");
	for(var i = 0; i<hullpoints.length; i++){
		hullpoints[i].setAttribute("class", "point");
		points.push(html_point.get(hullpoints[i]));
	}

	//delete lines
	$('.line').remove();
	UpdatePointCounters();
}

function DisableButtons(){
	document.getElementById("actualStartButton").style.backgroundColor = "#b90f0f";

	//algorithms dropdown menu
	var dropdown_elements = document.getElementById("algorithms-dropdown-menu").childNodes;
}

function EnableButtons(){
	document.getElementById("actualStartButton").style.backgroundColor = "#1abc9c";
}
