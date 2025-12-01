
function cross(a, b, o) {
   return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
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

async function ConvexHull_MonotoneChain() {
	points = []
	var nodes = $('.point');
	for(var i = 0; i<nodes.length; i++){
		points.push(html_point.get(nodes[i]));
	}

	var delay = getDelay();
	let sorted_by_x = points.sort((a,b) => a.x - b.x);
  	var lower = [];
	var lowerLines = []; // Track lower hull lines
  	hull = [];
  
	// Build lower hull
	for (var i = 0; i < sorted_by_x.length; i++) {
		if(shouldStopAnimation) break;
		
		highlightPoint(sorted_by_x[i], '#3498db');
		
		while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], sorted_by_x[i]) <= 0) {
			// Visualize the points being removed
			var removed = lower.pop();
			if(point_html.get(removed)){
				point_html.get(removed).className = "point";
				unhighlightPoint(removed);
			}
			// Remove the last line segment
			if(lowerLines.length > 0){
				var lastLine = lowerLines.pop();
				disconnectTwoPoints(lastLine);
			}
		}
		
		// Show the lower hull being built
		if(lower.length > 0){
			var tempLine = makeTemporaryLine(lower[lower.length-1], sorted_by_x[i], '#2ecc71');
			await sleep(delay);
			$(tempLine).remove();
		}
		
		if(shouldStopAnimation) break;
		
		var prevLowerLength = lower.length;
		lower.push(sorted_by_x[i]);
		addToHull(sorted_by_x[i]);
		// Highlight as finalized hull vertex
		highlightPoint(sorted_by_x[i], '#2ecc71');
		
		// Connect to previous point in lower hull
		if(prevLowerLength > 0){
			var line = connectTwoPoints(lower[prevLowerLength - 1], sorted_by_x[i]);
			lowerLines.push(line);
		}
		
		await sleep(delay / 2);
		unhighlightPoint(sorted_by_x[i]);
	}

	// Build upper hull
	var upper = [];
	var upperLines = []; // Track upper hull lines
	for (var i = sorted_by_x.length - 1; i >= 0; i--) {
		if(shouldStopAnimation) break;
		
		highlightPoint(sorted_by_x[i], '#e74c3c');
		
		while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], sorted_by_x[i]) <= 0) {
			var removed = upper.pop();
			if(point_html.get(removed)){
				point_html.get(removed).className = "point";
				unhighlightPoint(removed);
			}
			// Remove the last line segment
			if(upperLines.length > 0){
				var lastLine = upperLines.pop();
				disconnectTwoPoints(lastLine);
			}
		}
		
		// Show the upper hull being built
		if(upper.length > 0){
			var tempLine = makeTemporaryLine(upper[upper.length-1], sorted_by_x[i], '#9b59b6');
			await sleep(delay);
			$(tempLine).remove();
		}
		
		if(shouldStopAnimation) break;
		
		var prevUpperLength = upper.length;
		upper.push(sorted_by_x[i]);
		addToHull(sorted_by_x[i]);
		// Highlight as finalized hull vertex
		highlightPoint(sorted_by_x[i], '#2ecc71');
		
		// Connect to previous point in upper hull
		if(prevUpperLength > 0){
			var line = connectTwoPoints(upper[prevUpperLength - 1], sorted_by_x[i]);
			upperLines.push(line);
		}
		
		await sleep(delay / 2);
		unhighlightPoint(sorted_by_x[i]);
	}

	if(!shouldStopAnimation){
		upper.pop();
		lower.pop();
		
		// Remove the duplicate connecting lines
		if(lowerLines.length > 0) lowerLines.pop();
		if(upperLines.length > 0) upperLines.pop();

		//add both sets	
		hull = lower.concat(upper);

		hull.forEach(el => point_html.get(el).className = "point-hull");
		// Close the hull by connecting the ends of upper and lower
		if(hull.length >= 2){
			connectTwoPoints(hull[hull.length - 1], hull[0]);
		}
	}
	
	removeTemporaryLines();
	isRunning = false;
	EnableButtons();
}
