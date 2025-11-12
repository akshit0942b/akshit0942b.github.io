let isRunning = false;
let shouldStopAnimation = false;
let computationStartTime = 0;
let computationEndTime = 0;

function showStats(algorithmName, timeTaken, pointsProcessed, hullSize) {
	var statsBar = document.getElementById('statsBar');
	var statsAlgorithm = document.getElementById('statsAlgorithm');
	var statsTime = document.getElementById('statsTime');
	var statsPoints = document.getElementById('statsPoints');
	
	statsAlgorithm.textContent = 'Algorithm: ' + algorithmName;
	statsTime.textContent = 'Computation Time: ' + timeTaken.toFixed(3) + ' ms';
	statsPoints.textContent = 'Points: ' + pointsProcessed + ' | Hull: ' + hullSize;
	
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
	
	showStats(currentSelected, timeTaken, totalPoints, hullSize);

	//Restore original speed
	currentSelectedSpeed = originalSpeed;
	UpdatePointCounters();
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
