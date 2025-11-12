
function Angle(anchor, p){
	return Math.atan2( p.y - anchor.y, anchor.x - p.x) * 180/Math.PI + 180
}

function ccw(a, b, c) {
	//draw current point
	//line a -> b
	//line b -> c
	return ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) > 0;
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

async function ConvexHull_GrahamScale(){
	points = []
	var nodes = $('.point');
	for(var i = 0; i<nodes.length; i++){
		points.push(html_point.get(nodes[i]));
	}

	var delay = getDelay();

	let sorted_points = points.sort((a,b) => b.y - a.y);
	hull = [];
	let anchor = sorted_points[0];

	//lowest point is in hull
	hull.push(anchor);
	addToHull(anchor);
	highlightPoint(anchor, '#e74c3c');
	await sleep(delay);

	let sort_by_polar_angle = points;
	sort_by_polar_angle.splice( points.indexOf( anchor ), 1);
  	
  	//sort points by angle from x-axis (lowest point)
  	sort_by_polar_angle = points.sort((a, b) => {
	    let getTanAngleToP0 = (p) => ((p.x - p0.x) / (p.y - p0.y));
	    let angleA = Angle(anchor, a);
	    let angleB = Angle(anchor, b);
	    if (angleA == angleB) return angleA;
	    return angleA - angleB;
  	});


	let pointIndex = 0;
	let done = 0;

	while(done != points.length){
		if(shouldStopAnimation) break;
		
	  	let p = sort_by_polar_angle[pointIndex];
	  	if (p) {
			// Highlight current point being considered
			highlightPoint(p, '#3498db');
			
			// Show the triangle being tested
			if(hull.length >= 2){
				var tempLine1 = makeTemporaryLine(hull[hull.length - 2], hull[hull.length - 1], '#f39c12');
				var tempLine2 = makeTemporaryLine(hull[hull.length - 1], p, '#f39c12');
			}
			
			await sleep(delay);
			
			if(shouldStopAnimation) break;
			
	    	if (hull.length > 1 && ccw(hull[hull.length - 2], hull[hull.length - 1], p)) {
				// Point makes a right turn, remove last point from hull
				var removed = hull.pop();
				if(point_html.get(removed)){
					point_html.get(removed).className = "point";
					unhighlightPoint(removed);
				}
	    	} 
	    	else{
				// Point makes a left turn, add to hull
	      		hull.push(p);
				addToHull(p);
				pointIndex++;
				done++;
	    	}
			
			removeTemporaryLines();
			unhighlightPoint(p);
	    }
	    else{
	    	//closing line
	    	continue;
	    }
	}

	if(!shouldStopAnimation){
		hull.forEach(el => point_html.get(el).className = "point-hull");
		ConnectHull();
	}
	
	removeTemporaryLines();
	isRunning = false;
	EnableButtons();
}

