
function getVector(p1, p2){
	let vector = [];
	vector.push(p2.x - p1.x);
	vector.push(p1.y - p2.y); //reversed because of html coordinates
	return vector;
}

function crossProduct(a, b){
	//a,b as arrays not objects
	return a[0] * b[1] - a[1] * b[0];
}

async function findMaxCrossProductPoint(p, pointSet, delay){
	var comparePoint = pointSet[0];

	for(var i = 0; i < pointSet.length; i++){
		if(shouldStopAnimation) return null;
		
		// Highlight the point being tested
		highlightPoint(pointSet[i], '#3498db');
		
		// Draw temporary line to show comparison
		var tempLine = makeTemporaryLine(p, pointSet[i], '#3498db');
		
		await sleep(delay);
		
		if(crossProduct(getVector(p, comparePoint), getVector(p, pointSet[i])) >= 0){
			comparePoint = pointSet[i];
		}
		
		// Remove temporary line and unhighlight
		$(tempLine).remove();
		unhighlightPoint(pointSet[i]);
	}
	
	// Highlight the selected point
	highlightPoint(comparePoint, '#f39c12');
	await sleep(delay);
	
	return comparePoint;
}

function sleep(ms) {
	if(currentSelectedSpeed === 'Super Sonic' || shouldStopAnimation) return Promise.resolve();
	return new Promise(resolve => setTimeout(resolve, ms));
}

function getDelay(){
	switch(currentSelectedSpeed){
		case 'Super Sonic': return 0;
		case 'Fast': return 200;
		case 'Average': return 600;
		case 'Slow': return 1200;
		default: return 600;
	}
}

async function ConvexHull_JarvisMarch(){
	points = []
	var nodes = $('.point');
	for(var i = 0; i < nodes.length; i++){
		points.push(html_point.get(nodes[i]));
	}

	hull = [];
	let sorted_points = points.sort((a,b) => a.x - b.x);
	
	var delay = getDelay();
	
	//leftmost point is in hull (starting point for Jarvis March)
	hull.push(sorted_points[0]);
	addToHull(sorted_points[0]);
	await sleep(delay);

	var nxtPoint = null;
	while(nxtPoint != hull[0]){
		if(shouldStopAnimation) break;
		
		//find the most counter-clockwise point (Jarvis March step)
		var nxtPoint = await findMaxCrossProductPoint(hull[hull.length-1], sorted_points, delay);
		
		if(nxtPoint === null || shouldStopAnimation) break;
		
		hull.push(nxtPoint);

		//change classname for colorchange
		addToHull(nxtPoint);
		
		// Highlight as finalized hull vertex with bright green
		highlightPoint(nxtPoint, '#2ecc71');
		await sleep(delay / 2);

		//pop new hullpoint out of point set 
		sorted_points.splice(sorted_points.indexOf(hull[hull.length-1]), 1);
		
		await sleep(delay);
	}

	if(!shouldStopAnimation){
		//the first hullpoint is added twice
		hull.pop();

		hull.forEach(el => point_html.get(el).className = "point-hull");
		ConnectHull();
	}
	
	removeTemporaryLines();
	isRunning = false;
	EnableButtons();
}
