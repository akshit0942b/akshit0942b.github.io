
function getMinMaxPoints(pointSet) {
    var i;
    var minPoint;
    var maxPoint;

    minPoint = pointSet[0];
    maxPoint = pointSet[0];

    for(i=1; i<pointSet.length; i++) {
        if(pointSet[i].x < minPoint.x)
            minPoint = pointSet[i];
        if(pointSet[i].x > maxPoint.x)
            maxPoint = pointSet[i];
    }

    return [minPoint, maxPoint];
}

function distanceFromLine(point, line) {
    var vY = line[1].y - line[0].y;
    var vX = line[0].x - line[1].x;
    return (vX * (point.y - line[0].y) + vY * (point.x - line[0].x))
}

function distalPoints(line, points) {
    var i;
    var outer_points = [];
    var point;
    var distal_point;
    var distance=0;
    var max_distance=0;

    for(i = 0; i<points.length; i++) {
        point = points[i];
        distance = distanceFromLine(point,line);

        if(distance > 0) outer_points.push(point);
        else continue; //short circuit

        if(distance > max_distance) {
            distal_point = point;
            max_distance = distance;
        }
    }

    return {points: outer_points, max: distal_point};
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

async function addSegments(line, points, delay) {
    if(shouldStopAnimation) return;
    
    // Visualize the line being processed
    var tempLine = makeTemporaryLine(line[0], line[1], '#9b59b6');
    await sleep(delay);
    
    if(shouldStopAnimation) {
        $(tempLine).remove();
        return;
    }
    
    var distal = distalPoints(line, points);
    
    if(!distal.max) {
        $(tempLine).remove();
        // Finalize this point as a hull vertex
        var prevHullLength = hull.length;
        hull.push(line[0]);
        addToHull(line[0]);
        highlightPoint(line[0], '#2ecc71');
        
        // Connect to previous hull point if exists
        if(prevHullLength > 0){
            connectTwoPoints(hull[prevHullLength - 1], line[0]);
        }
        
        await sleep(delay / 2);
        return;
    }
    
    // Highlight the farthest point found
    highlightPoint(distal.max, '#e74c3c');
    
    // Show triangle formed
    var tempLine2 = makeTemporaryLine(line[0], distal.max, '#3498db');
    var tempLine3 = makeTemporaryLine(distal.max, line[1], '#3498db');
    await sleep(delay);
    
    if(shouldStopAnimation) {
        $(tempLine).remove();
        $(tempLine2).remove();
        $(tempLine3).remove();
        return;
    }
    
    // Clean up temporary visualizations
    $(tempLine).remove();
    $(tempLine2).remove();
    $(tempLine3).remove();
    unhighlightPoint(distal.max);
    
    await addSegments([line[0], distal.max], distal.points, delay);
    await addSegments([distal.max, line[1]], distal.points, delay);
}

async function ConvexHull_Quickhull(){
    points = []
    var nodes = $('.point');
    for(var i = 0; i<nodes.length; i++){
        points.push(html_point.get(nodes[i]));
    }

	var delay = getDelay();
	hull = [];
	var middleLine = getMinMaxPoints(points);

    // Highlight the extreme points
    highlightPoint(middleLine[0], '#e74c3c');
    highlightPoint(middleLine[1], '#e74c3c');
    
    // Show the initial dividing line
    var initialLine = makeTemporaryLine(middleLine[0], middleLine[1], '#e74c3c');
    await sleep(delay * 2);
    $(initialLine).remove();

    await addSegments(middleLine, points, delay);
    if(shouldStopAnimation) {
        removeTemporaryLines();
        isRunning = false;
        EnableButtons();
        return;
    }
    
    //reverse line direction to get points on other side
    await addSegments([middleLine[1], middleLine[0]], points, delay);

    if(!shouldStopAnimation){
        //add the last point to make a closed loop
        hull.push(hull[0]);
        hull.pop();

        hull.forEach(el => point_html.get(el).className = "point-hull");
        // Connect the last point back to first to close the hull
        if(hull.length >= 2){
            connectTwoPoints(hull[hull.length - 1], hull[0]);
        }
    }
    
    removeTemporaryLines();
    isRunning = false;
    EnableButtons();
}

